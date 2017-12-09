class Router {
  constructor() {

    this.stack = [];
    const method = ['get', 'post', 'head', 'delete', 'put', 'all'];
    for(const v of method) {
      this[v] = (path, fn) => {
        this.stack.push({ path, method: v, fn });
      }
    }
  }
  use(path, fn) {
    this.stack.push({ path, method: 'stack', fn });
  }

  routes() {
    return async (ctx, next) => {
      const { method, path } = ctx;
      console.log(method, 'method');
      const result = this.stack.filter(item => method === item.method.toUpperCase()).filter(item => path.match(new RegExp(item.path)));
      console.log(result, 'result');
      next();
    }
  }
}

module.exports = Router;