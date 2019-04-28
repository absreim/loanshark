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

const getPending = (userId) => {
    const lendingPromise = db.models.loan.findAll({
        where: {
            lenderId: userId,
            acceptedDate: null
        }
    })
    const borrowingPromise = db.models.loan.findAll({
        where: {
            borrowerId: userId,
            acceptedDate: null
        }
    })
    return Promise.all([lendingPromise, borrowingPromise])
}
const getOutstanding = (userId) => {
    const lendingPromise = db.models.loan.findAll({
        where: {
            lenderId: userId,
            acceptedDate: {
                [Sequelize.Op.ne]: null
            },
            returnDate: null
        }
    })
    const borrowingPromise = db.models.loan.findAll({
        where: {
            borrowerId: userId,
            acceptedDate: {
                [Sequelize.Op.ne]: null
            },
            returnDate: null
        }
    })
    return Promise.all([lendingPromise, borrowingPromise])
}
const getCompleted = (userId) => {
    const lendingPromise = db.models.loan.findAll({
        where: {
            lenderId: userId,
            returnDate: {
                [Sequelize.Op.ne]: null
            }
        }
    })
    const borrowingPromise = db.models.loan.findAll({
        where: {
            borrowerId: userId,
            returnDate: {
                [Sequelize.Op.ne]: null
            }
        }
    })
    return Promise.all([lendingPromise, borrowingPromise])
}

router.get('/',async ctx => {
    const userId = ctx.user.id
    try {
        const [pending, outstanding, completed] = await Promise.all([
            getPending(userId), getOutstanding(userId), getCompleted(userId)
        ])
        ctx.body = {
            pending: {
                lending: pending[0],
                borrowing: pending[1]
            },
            outstanding: {
                lending: outstanding[0],
                borrowing: outstanding[1]
            },
            completed: {
                lending: completed[0],
                borrowing: completed[1]
            }
        }
    }
    catch (err){
        ctx.throw(500)
    }
})

router.get('/pending', async ctx => {
    try {
        const [lending, borrowing] = await getPending(ctx)
        ctx.body = {lending, borrowing}
    }
    catch (err) {
        ctx.throw(500)
    }
})

router.get('/outstanding', async ctx => {
    try {
        const [lending, borrowing] = await getOutstanding(ctx)
        ctx.body = {lending, borrowing}
    }
    catch (err) {
        ctx.throw(500)
    }
})

router.get('/completed', async ctx => {
    try {
        const [lending, borrowing] = await getCompleted(ctx)
        ctx.body = {lending, borrowing}
    }
    catch (err) {
        ctx.throw(500)
    }
})

// create new pending loan
router.post('/pending', async ctx => {
    const reqBody = ctx.request.body
    if (reqBody && reqBody.description &&
        reqBody.value && reqBody.lendDate &&
        reqBody.promisedDate && reqBody.borrowerId){
        ctx.body = db.models.loan.create({
            description: reqBody.description,
            value: reqBody.value,
            lendDate: reqBody.lendDate,
            promisedDate: reqBody.promisedDate,
            borrowerId: reqBody.borrowerId
        },{
            returning: true
        })
    }
    else {
        ctx.throw(400)
    }
})

// approve proposed (pending) loan
router.put('/pending/:id/approve', async ctx => {
    const loanId = ctx.params.id
    if (!loanId){
        ctx.throw(400)
    }
    let loan = null
    try {
        loan = await db.models.loan.findOne({
            where : {
                borrowerId: loanId,
                acceptedDate: null
            }
        })
    }
    catch (err){
        ctx.throw(500)
        return
    }
    if(!loan){
        ctx.throw(404)
        return
    }
    try {
        ctx.body = await loan.update({
            acceptedDate: Sequelize.fn('NOW')
        }, {
            returning: true
        })
    }
    catch (err){
        ctx.throw(500)
    }
})

// complete outstanding loan, representing borrowed
// items being returned
router.put('/outstanding/:id/complete', async ctx => {
    const loanId = ctx.params.id
    if (!loanId){
        ctx.throw(400)
    }
    let loan = null
    try {
        loan = await db.models.loan.findOne({
            where : {
                borrowerId: loanId,
                acceptedDate: {
                    [Sequelize.Op.ne]: null
                },
                returnDate: null
            }
        })
    }
    catch (err){
        ctx.throw(500)
        return
    }
    if(!loan){
        ctx.throw(404)
        return
    }
    try {
        ctx.body = await loan.update({
            returnDate: Sequelize.fn('NOW')
        }, {
            returning: true
        })
    }
    catch (err){
        ctx.throw(500)
    }
})

module.exports = router
