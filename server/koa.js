const Koa = require('koa')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const KoaRouter = require('koa-router')
const cors = require('@koa/cors')

const apiRouter = require('./api')

const app = new Koa()

app.use(bodyParser())

const secret = process.env.SECRET || 'I\'m coming for you!'
app.keys = [secret]

app.use(session(app))

require('./auth')
app.use(passport.initialize())
app.use(passport.session())

const rootRouter = new KoaRouter()
rootRouter.use('/api', apiRouter.routes())

app.use(rootRouter.routes())

app.use(cors({ credentials: true }))

module.exports = app
