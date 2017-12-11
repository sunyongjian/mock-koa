
const Router = require('../src/koaRouter');

const router = new Router();
module.exports = router;

router.get('/index', async (ctx, next) => {
  let title = 'hello koa2';
  console.log(111);
  await ctx.render('index', {
    title,
    text: title,
    list: ['北京', '上海', '广东']
  });
  next();
});

router.get('/login', async (ctx, next) => {
  await ctx.render('login', {
    title: '登录页',
  });
  next();
})

router.post('/signin', async(ctx, next) => {
  console.log(ctx.req.body, 'requset');
  const { username, password } = ctx.req.body;
  if (username === 'sunyongjian' && password === '1') {
    console.log('okkkkk');
    await ctx.render('success', {
      title: '登陆成功',
    });
    ctx.cookies().set('a', 'b', {
      httpOnly: true,
      path: '/',
      maxAge: 10,
    })
    next();
  }
  next();
})

router.get('/', async (ctx) => {

   await new Promise((resolve) => {
    setTimeout(() => {
      console.log('router');
      resolve()
      ctx.body = '首页';
    }, 1000)
  });
});


router.get('/user', (ctx) => {
  ctx.body = 'user';
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
})