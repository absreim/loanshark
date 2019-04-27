const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy

const db = require('./db')

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
    try {
        const user = await db.models.user.findByPk(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})

passport.use(new LocalStrategy(async function(username, password, done) {
    try {
        const user = await db.models.user.findOne({where: {email: username}})
        if(user){
            const correctPwd = await user.correctPassword(password)
            if (correctPwd){
                done(null, user)
            }
            else {
                done(null, false)
            }
        }
        else {
            done(null, false)
        }
    } catch (err){
        done(err)
    }
}))

module.exports = passport
