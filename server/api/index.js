const KoaRouter = require('koa-router')

const authRouter = require('./auth')

const router = new KoaRouter()

router.use('/auth', authRouter.routes())

module.exports = router
