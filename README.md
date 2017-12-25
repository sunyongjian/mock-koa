### Introduction
Read Koa source code, and achieve a simple koa.

### Example
#### scripts
```
git clone https://github.com/sunyongjian/mock-koa.git

yarn

node example/index.js
```

#### usage
```js
// example
const Koa = require('../src/index');
const fs = require('fs');
const path = require('path');
const app = new Koa();

const bodyParse = require('../src/bodyParse');
const cookieParse = require('../src/cookieParse');
const static = require('../src/static');
const Router = require('../src/koaRouter');
const views = require('../src/koaViews');

const router = new Router();


app.use(bodyParse());
app.use(cookieParse());
app.use(static(path.join(__dirname + '/static')));

app.use(views(path.join(__dirname + '/views'), {
  ext: 'ejs'
}));

app.use(async (ctx, next) => {
  let title = 'hello koa2'
  await ctx.render('index', {
    title,
    text: title,
    list: ['北京', '上海', '广东']
  });
  next();
});

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
- [x] render template
- [ ] error handling
