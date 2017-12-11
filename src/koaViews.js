const fs = require('mz/fs');
const path = require('path');
const ejs = require('ejs');

const views = (dir, options = {}) => async (ctx, next) => {
  if (ctx.render) return next();
  ctx.render = (pathname, locals) => {
    return new Promise(async(resolve) => {
      const { ext = 'html' } = options;
      const p = path.resolve(__dirname, path.join(dir + '/' + pathname + '.'+ ext));
      console.log(p, 'pppp');
      try {
        const s = await fs.stat(p);
        if (!s.isFile()) return await next();
        const body = await fs.readFile(p)
        const string = ejs.render(body.toString(), locals);
        ctx.body = string;
        resolve();
      } catch(e) {
        console.log(e);
      }
    })
    next(); 
  }
  return await next();

}

module.exports = views;