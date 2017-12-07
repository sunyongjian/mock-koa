const fs = require('mz/fs');
const path = require('path');
var mime = require('mime-types');


const static = dir => async (ctx, next) => {
  dir = path.normalize(dir);  
  const filename = path.resolve(__dirname, path.join(dir, ctx.path));

  try {
    const s = await fs.stat(filename);
    if(!s.isFile()) return await next();

    const type = mime.lookup(filename) || 'application/octet-stream';

    const body = await fs.readFile(filename);
    ctx.status = 200;
    ctx.type = type;
    ctx.body = body;
    //TODO  缓存，lastmodified/etag/maxage

  } catch(e) {
    return await next();
  }

  await next();  
  
}

module.exports = static;