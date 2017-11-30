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

  callback() {
    const compose = (middlewares) => {
      return (context) => {
        let index = 0;
        function next() {
          middlewares[index++](context, next);
        }
        next();
      }
    }
    const fn = compose(this.middlewares);
    return (req, res) => {
      this.context.req = req;
      this.context.res = res;
      fn(this.context);
    }
  }
}