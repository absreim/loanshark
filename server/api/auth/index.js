const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('/me', (ctx, _) => {
    ctx.body = ctx.user
})

module.exports = router
