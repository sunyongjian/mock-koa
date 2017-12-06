const http = require('http');

module.exports = class Koa {
  constructor() {

    this.middlewares = [];
    this.context = {};
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  listen(...args) {
    return http.createServer(this.callback()).listen(...args);
  }

  compose(middlewares) {
    return (context) => {
      let index = 0;
      // 为了每个中间件都可以是异步调用，即 `await next()` 这种写法，每个 next 都要返回一个 promise 对象

      function next(index) {
        const func = middlewares[index];
        return new Promise((resolve, reject) => {
          if (index >= middlewares.length) return reject('next is inexistence');
          resolve(func(context, () => next(index + 1)));
        });
      }
      return next(index);
    }
  }

  callback() {
    const fn = this.compose(this.middlewares);
    return (req, res) => {
      try {
        this.handleCtx(req, res);
        this.context.res.statusCode = 404;

        fn(this.context).then((x) => {
          console.log('ok then', x);
          this.response(this.context);
        });

      } catch(e) {
        console.log(e, 'eee');
      }
    }
  }

  handleCtx(req, res) {
    const { context } = this;

    context.req = req;
    context.res = res;
  }

  response(ctx) {
    const { res, body } = ctx;
    console.log(body, 'body');
    res.end(body);
  }
}