const Sequelize = require('sequelize')

const db = require('../db')

const Loan = db.define('Loan', {
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
    },
    // null if loan is still pending acceptance by borrower
    acceptedDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    // null if loan is still outstanding (items not yet returned)
    returnDate: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

module.exports = Loan
