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
    const pending = await getPending()
    const outstanding = await getOutstanding()
    const completed = await getCompleted()
    ctx.body = {pending, outstanding, completed}
})

router.get('/pending', async ctx => {
    ctx.body = await getPending()
})

router.get('/outstanding', async ctx => {
    ctx.body = await getOutstanding()
})

router.get('/completed', async ctx => {
    ctx.body = await getCompleted()
})
