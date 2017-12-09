const Koa = require('../src/index');
const fs = require('fs');
const path = require('path');
const app = new Koa();
const bodyParse = require('../src/bodyParse');
const cookieParse = require('../src/cookieParse');
const static = require('../src/static');
const Router = require('../src/koaRouter');

const router = new Router();
console.log(router, 'router');

app.use(bodyParse());
app.use(cookieParse());
app.use(static(path.join(__dirname + '/static')));

app.use(router.routes());
// cookie
app.use(async (ctx, next) => {
  ctx.cookies().set('a', 'b', {
    httpOnly: true,
    path: '/',
    maxAge: 10,
  })
  ctx.cookies().set('c', 'd', {
    httpOnly: true,
  })
  await next();
})

router.get('/', async(ctx) => {
  ctx.body = 'Hello World'; 
});
// logger
app.use(async (ctx, next) => {
  console.log(ctx.req.body, 'body');
  await next();
})

// body

app.use(async (ctx, next) => {
  // TODO
  // ctx.body = 'hello world';
  // ctx.res.statusCode = 200;
  await next();
  console.log('wanle');
});


const readFile = (fileName, ctx) => {
  return new Promise((resolve) => {
    typeof fileName === 'string' &&
      fs.readFile(fileName, (err, buffer) => {
        ctx.bufferData = buffer;
        resolve();
      })
  })
}
// test async 
app.use(async (ctx, next) => {
  await readFile('./package.json', ctx);
  console.log(ctx.bufferData);
  console.log('next end');
})

const port = 3000;

app.listen(port, () => {
  console.log('server is listen port:' + port);
});