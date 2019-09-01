const { DataSource } = require('apollo-datasource')
const Sequelize = require('sequelize')

class Psql extends DataSource {
  constructor({ store }){
    super()
    this.store = store
    this.PENDING = 'PENDING'
    this.OUTSTANDING = 'OUTSTANDING'
    this.COMPLETED = 'COMPLETED'
    this.LENDING = 'LENDING'
    this.BORROWING = 'BORROWING'
  }

  getLoans(type, role, user){
    if (user === null || user === undefined){
      return []
    }
    const userId = user.id
    let whereObj = null
    switch (type){
      case this.PENDING:
        whereObj = {
          acceptedDate: null
        }
        break
      case this.OUTSTANDING:
        whereObj = {
          acceptedDate: {
            [Sequelize.Op.ne]: null
          },
          returnDate: null
        }
        break
      case this.COMPLETED:
        whereObj = {
          returnDate: {
            [Sequelize.Op.ne]: null
          }
        }
        break
      default:
        throw new Error(`Unknown loan type: ${type}`)
    }
    switch (role){
      case this.BORROWING:
        whereObj.borrowerId = userId
        break
      case this.LENDING:
        whereObj.lenderId = userId
        break
      default:
        throw new Error(`Unknown role: ${role}`)
    }
    const { loan, user } = this.store.models
    return loan.findAll({
      where: whereObj,
      include: [
        {
          model: user,
          as: 'borrower'
        },
        {
          model: user,
          as: 'lender'
        }
      ]
    })
  }
}

module.exports = Psql
