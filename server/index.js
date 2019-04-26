const Koa = require('koa')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(bodyParser())

app.keys = ['I\'m coming for you!']

app.use(session(app))
