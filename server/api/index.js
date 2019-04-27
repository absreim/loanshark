const KoaRouter = require('koa-router')

const authRouter = require('./auth')
const loanRouter = require('./loans')

const router = new KoaRouter()

router.use('/auth', authRouter.routes())
router.use('/loans', loanRouter.routes())

module.exports = router
