const fs = require('mz/fs');
const path = require('path');


const session = (config, app) => async (ctx, next) => {
  console.log(config);
  ctx.session = {};

  await next();  
  
}

module.exports = session;