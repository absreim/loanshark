const KoaRouter = require('koa-router')

const authRouter = require('./auth')
const loansRouter = require('./loans')
const usersRouter = require('./users')

const router = new KoaRouter()

router.use('/auth', authRouter.routes())
router.use('/loans', loansRouter.routes())
router.use('/users', usersRouter.routes())

module.exports = router
