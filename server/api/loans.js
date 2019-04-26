const KoaRouter = require('koa-router')
const Sequelize = require('sequelize')

const db = require('../db')

const router = new KoaRouter()

router.use(async (ctx, next) => {
    if(!ctx.isAuthenticated()){
        throw(401)
    }
    else {
        await next()
    }
})

const getPending = async () => {
    return db.models.loan.findAll({
        where: {
            userId: ctx.user.id,
            acceptedDate: null
        }
    })
}
const getOutstanding = async () => {
    return db.models.loan.findAll({
        where: {
            userId: ctx.user.id,
            acceptedDate: {
                [Sequelize.Op.ne]: null
            },
            returnDate: null
        }
    })
}
const getCompleted = async () => {
    return db.models.loan.findAll({
        where: {
            userId: ctx.user.id,
            returnDate: {
                [Sequelize.Op.ne]: null
            }
        }
    })
}

router.get('/',async ctx => {
    try {
        const pending = await getPending()
        const outstanding = await getOutstanding()
        const completed = await getCompleted()
        ctx.body = {pending, outstanding, completed}
    }
    catch (err){
        ctx.throw(500)
    }
})

router.get('/pending', async ctx => {
    try {
        ctx.body = await getPending()
    }
    catch (err) {
        ctx.throw(500)
    }
})

router.get('/outstanding', async ctx => {
    try {
        ctx.body = await getOutstanding()
    }
    catch (err) {
        ctx.throw(500)
    }
})

router.get('/completed', async ctx => {
    try {
        ctx.body = await getOutstanding()
    }
    catch (err) {
        ctx.throw(500)
    }
})
