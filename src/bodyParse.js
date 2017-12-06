
const qs = require('querystring');

const getReqData = (req) => {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    })
    req.on('end', () => {
      resolve(data);
    })
  })
}

const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

const parseJson = (str) => {
  if (!str) return {};

  if (!strictJSONReg.test(str)) {
    throw new Error('invalid JSON, only supports object and array');
  }
  return JSON.parse(str);
}

const jsonTypes = 'application/json';

const formTypes = 'application/x-www-form-urlencoded';

const textTypes = 'text/plain';

// TODO form-data
const parseBody = (ctx, body) => {
  const { headers = {}, } = ctx.req;
  const mime = headers['content-type'];

  if (mime === jsonTypes) {
    return parseJson(body);
  }
  if (mime === formTypes) {
    return qs.parse(body.toString());
  }
  if (mime === textTypes) {
    return body.toString();
  }
  return body;
}


module.exports = () => async function(ctx, next) {
  const reqBody = await getReqData(ctx.req);
  const body = parseBody(ctx, reqBody);
  ctx.req.body = body;
  next();
}