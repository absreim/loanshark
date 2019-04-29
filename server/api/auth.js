const KoaRouter = require('koa-router')
const passport = require('koa-passport')

const db = require('../db')

const router = new KoaRouter()

router.get('/me', ctx => {
    ctx.body = ctx.state.user
})

router.post('/login', ctx => {
    return passport.authenticate('local', function(err, user) {
        if (user === false) {
            ctx.throw(401)
        } else {
            ctx.body = user
            return ctx.login(user)
        }
    })(ctx)
})

router.post('/logout', ctx => {
    ctx.logout()
    ctx.status = 204
})

router.post('/signup', async ctx => {
    const reqBody = ctx.request.body
    if (reqBody && reqBody.email && reqBody.password && reqBody.name){
        try {
            const user = await db.models.user.create({
                email: reqBody.email,
                name: reqBody.name,
                password: reqBody.password
            }, {
                returning: true
            })
            ctx.login(user)
            ctx.body = user
        }
        catch (err){
            if (err.name === 'SequelizeUniqueConstraintError'){
                ctx.throw(401, 'User already exists')
            }
            else {
                ctx.throw(500)
            }
        }
    }
    else {
        ctx.throw(400)
    }
})

module.exports = router
