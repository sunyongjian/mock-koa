const http = require('http');
const url = require('url');
const qs = require('querystring');

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
        this.context.body = 'not fount';

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
    const { pathname, query } = url.parse(req.url);
    const queryKv = qs.parse(query);
    context.req = context.request = req;
    context.res = context.response = res;

    context.headers = [];
    context.path = pathname;
    context.method = req.method;
    context.query = queryKv;
  }

  response(ctx) {
    const { res, body, headers, status, type } = ctx;
    console.log(body, status, type, 'body');
    if (headers) res.setHeader('Set-Cookie', ctx.headers);//TODO 最后 headers 及 cookie 的设置在哪比较好
    if (type) res.setHeader('Content-Type', type);
    if (status) res.statusCode = status;

    res.end(body);
  }
}