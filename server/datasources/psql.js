const { DataSource } = require('apollo-datasource')
const Sequelize = require('sequelize')

class Psql extends DataSource {
  constructor({ store }){
    super()
    this.store = store
  }

  getPendingBorrowingLoansForUser(userId){
    if (userId === null || userId === undefined){
      return []
    }
    else {
      return this.store.models.loan.findAll({
        where: {
          lenderId: userId,
          acceptedDate: null
        },
        include: [
          {
            model: this.store.models.user,
            as: 'borrower'
          },
          {
            model: this.store.models.user,
            as: 'lender'
          }
        ]
      })
    }
  }

  getPendingLendingLoansForUser(userId){
    if (userId === null || userId === undefined){
      return []
    }
    else {
      return this.store.models.loan.findAll({
        where: {
            borrowerId: userId,
            acceptedDate: null
        },
        include: [
          {
            model: this.store.models.user,
            as: 'borrower'
          },
          {
            model: this.store.models.user,
            as: 'lender'
          }
        ]
      })
    }
  }

  getOutstandingBorrowingLoans(userId){
    if (userId === null || userId === undefined){
      return []
    }
    else {
      return this.store.models.loan.findAll({
        where: {
          borrowerId: userId,
          acceptedDate: {
              [Sequelize.Op.ne]: null
          },
          returnDate: null
        },
        include: [
          {
            model: this.store.models.user,
            as: 'borrower'
          },
          {
              model: this.store.models.user,
              as: 'lender'
          }
        ]
      })
    }
  }

  getOutstandingBorrowingLoans(userId){
    if (userId === null || userId === undefined){
      return []
    }
    else {
      return this.store.models.loan.findAll({
        where: {
          lenderId: userId,
          acceptedDate: {
              [Sequelize.Op.ne]: null
          },
          returnDate: null
        },
        include: [
          {
            model: this.store.models.user,
            as: 'borrower'
          },
          {
              model: this.store.models.user,
              as: 'lender'
          }
        ]
      })
    }
  }
}

module.exports = Psql
