const fs = require('mz/fs');
const path = require('path');
const ejs = require('ejs');

//TODO locals
const views = (dir, options = {}) => async (ctx, next) => {
  if (ctx.render) return next();
  ctx.render = async(pathname, locals) => {
    const { ext = 'html' } = options;
    const p = path.resolve(__dirname, path.join(dir + '/' + pathname + '.'+ ext));

    try{
      const s = await fs.stat(p);
      if (!s.isFile()) return await next();
      
      if(ctx.path === '/' + pathname) {
        const body = await fs.readFile(p)
        const string = ejs.render(body.toString(), locals);
        ctx.body = string;
      }
    } catch(e) {
      console.log(e);
    }
    
  }
  return await next();

}

module.exports = views;