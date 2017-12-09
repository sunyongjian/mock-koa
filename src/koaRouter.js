
const pathToRegExp = require('path-to-regexp');

class Layer {
  constructor(path, method, middleware) {
    this.stack = middleware;
    this.regexp = pathToRegExp(path);
    this.path = path;
    this.method = method.toUpperCase();
  }

  match(path) {
    return this.regexp.test(path);
  }
}

class Router {
  constructor() {

    this.middleware = [];
    const method = ['get', 'post', 'head', 'delete', 'put', 'all'];
    for(const v of method) {
      this[v] = (path, fn) => {
        this.middleware.push(new Layer(path, v, fn));
      }
    }
  }
  use(path, fn) {
    this.middleware.push({ path, method: 'stack', fn });
  }

  routes() {
    return async (ctx, next) => {
      const { method, path } = ctx;
      
      const result = this.middleware.filter(item => method === item.method || item.method === 'stack').filter(item => {
        const isMatch = item.match(path);

        if (!isMatch || path.includes(':')) {
          return isMatch;
        }
        const params = {};
        const values = item.regexp.exec(path);
        const ks = [];
        item.path.replace(/:([^\/]+)/g, function (res, k) {
          ks.push(k);
        });
        console.log(ks, 'ks', values, 'values');
        for(let i = 0; i < ks.length; i++) {
          params[ks[i]] = values[i + 1];
        }
        ctx.params = params;
        return isMatch;
      });

      if (result && result.length) {
        await result[0].stack(ctx, next);
      } else {
        await next();
      }
    }
  }
}

module.exports = Router;