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
        const user = await db.models.user.findOne({email: username})
        if(user && await user.correctPassword(password)){
            done(null, user)
        }
        else {
            done(null, false)
        }
    } catch (err){
        done(err)
    }
}))

module.exports = passport
