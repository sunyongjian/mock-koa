const fs = require('mz/fs');
const path = require('path');

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
        console.log(body, 'match');
        ctx.body = body;
      }
    } catch(e) {
    }
    
  }
  return await next();

}

module.exports = views;