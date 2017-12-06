### mock-koa
简单实现 koa，能达到正常的使用。

### start

```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

### TODO
- [x] simple-app
- [x] listen
- [x] middleware
- [x] async/await
- [ ] router
- [x] bodyParser
- [ ] static
- [x] cookie
- [ ] session
- [ ] render template
- [ ] error handling