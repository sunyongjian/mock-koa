### mock-koa
简单实现 koa，能达到正常的使用。

### start

```js
// example
const Koa = require('../src/index');
const fs = require('fs');
const path = require('path');
const app = new Koa();

const bodyParse = require('../src/bodyParse');
const cookieParse = require('../src/cookieParse');
const static = require('../src/static');

app.use(bodyParse());
app.use(cookieParse());
app.use(static(path.join(__dirname + '/static')));


router.get('/user/:name/:age', (ctx) => {
  const { name, age } = ctx.params;
  ctx.body = `${ctx.method}-${name}-${age}`;
});

router.delete('/user/:id', async(ctx) => {
  console.log(ctx.params, 'yoyoyo');
  // test async delete;
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('delete');
      resolve()
    }, 1000)
  });
  ctx.body = `${ctx.method}-${ctx.params.id}`;
});

// inject routes;
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

// logger
app.use(async (ctx, next) => {
  console.log(ctx.req.body, 'body');
  await next();
})


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
```

### TODO
- [x] simple-app
- [x] listen
- [x] middleware
- [x] async/await
- [x] router
- [x] bodyParser
- [x] static
- [x] cookie
- [ ] session
- [ ] render template
- [ ] error handling