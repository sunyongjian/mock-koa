// cookie options
const path = '/';
const expires = undefined;
const domain = undefined;
const httpOnly = true;
const sameSite = false;
const secure = false;
const overwrite = false;

const optionsHandle = (options, kv) => {
  let header = kv;
  let { maxAge, path, expires, domain, sameSite, secure, httpOnly } = options;
  if (maxAge) expires = new Date(Date.now() + maxAge);

  if (path) header += "; path=" + path;
  if (expires) header += "; expires=" + expires.toUTCString();
  if (domain) header += "; domain=" + domain;
  if (sameSite) header += "; samesite=" + (sameSite === true ? 'strict' : sameSite.toLowerCase());
  if (secure) header += "; secure";
  if (httpOnly) header += "; httponly";
  return header;
}

const splitCookie = (cookie) => {
  if(!cookie) return;
  return cookie.split('; ').reduce((res, cur) => {
    const [k, v] = cur.split('=');
    return Object.assign(res, { [k]: v })
  }, {})
}

module.exports = () => async function (ctx, next) {

  const cookie = splitCookie(ctx.req.headers.cookie);

  console.log(cookie, 'vsvs');

  const cookieHandle = () => {
    return {
      get(name, options) {
        return cookie[name];
      },
      set(name, value, options) {
        const header = optionsHandle(options, `${name}=${value}`);
        ctx.headers.push(header);
      }
    }
  }

  ctx.cookies = cookieHandle;
  next();
}