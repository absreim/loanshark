const Sequelize = require('Sequelize')

const db = require('../db')

const User = db.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        // Leave open possibility of sign up with OAuth only.
        // If password is null, disallow local login.
        allowNull: true,
        validate: {
            notEmpty: true
        }
    }
})

module.exports = User
