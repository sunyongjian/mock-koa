const Koa = require('../src/index');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  console.log(ctx);
  next();
})

// res
app.use(async (ctx, next) => {
  // TODO
  // ctx.body('Hello World');
  ctx.res.end('Hello World');
});

const port = 3000;

app.listen(port, () => {
  console.log('server is listen port:' + port);
});