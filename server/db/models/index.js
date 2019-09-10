const Loan = require('./loan')
const User = require('./user')

module.exports = { Loan, User }

User.hasMany(Loan, { as: 'lender' })
User.hasMany(Loan, { as: 'borrower' })
Loan.belongsTo(User, { as: 'lender', foreignKey: 'lenderId' })
Loan.belongsTo(User, { as: 'borrower', foreignKey: 'borrowerId' })
