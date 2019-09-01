const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

const db = require('../db')

const SALT_ROUNDS = 10

const User = db.define('user',
    {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            // Leave open possibility of sign up with OAuth only.
            // If password is null, disallow local login.
            allowNull: true,
            validate: {
                notEmpty: true
            },
            // Making `.password` act like a func hides it when serializing to JSON.
            // This is a hack to get around Sequelize's lack of a "private" option.
            // validate: {
            //   notEmpty: true
            // },
            get() {
                return () => this.getDataValue('password')
            }
        },
    },
    {
        indexes: [{unique: true, fields: ['email']}]
    })

/**
 * instanceMethods
 */
User.prototype.correctPassword = async function(candidatePwd) {
    const password = this.password()
    const compareResult = await bcrypt.compare(candidatePwd, password)
    return compareResult
}

/**
 * classMethods
 */
User.encryptPassword = function(plainText) {
    return bcrypt.hash(plainText, SALT_ROUNDS)
}

/**
 * hooks
 */
const setSaltAndPassword = async user => {
    if (user.changed('password')) {
        user.password = await User.encryptPassword(user.password())
    }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users =>
    Promise.all(users.map(user => user.setSaltAndPassword())))

module.exports = User
