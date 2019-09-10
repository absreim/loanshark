const KoaRouter = require('koa-router')

const db = require('../db')

const router = new KoaRouter()

router.get('/', async ctx => {
  ctx.body = await db.models.user.findAll()
})

module.exports = router
