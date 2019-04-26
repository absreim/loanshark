const Sequelize = require('sequelize')

const db = require('../db')

const OutstandingLoan = db.define('outstandingLoan', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    imageName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    lendDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    promisedDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

module.exports = OutstandingLoan
