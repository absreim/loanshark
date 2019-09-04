const { DataSource } = require('apollo-datasource')
const Sequelize = require('sequelize')
const { AuthenticationError,
  UserInputError, ApolloError } = require('apollo-server-koa')

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
    const loanModel = this.store.models.loan
    const userModel = this.store.models.user
    return loanModel.findAll({
      where: whereObj,
      include: [
        {
          model: userModel,
          as: 'borrower'
        },
        {
          model: userModel,
          as: 'lender'
        }
      ]
    })
  }

  errorOnUnauth(user){
    if (user === null || user === undefined){
      throw new AuthenticationError(
        'You must be logged in to perform this action.'
        )
    }
  }

  createLoan(description, value, lendDate, promisedDate, borrowerId, user){
    this.errorOnUnauth(user)
    if (!(description && value >= 0 && lendDate && promisedDate
      && borrowerId >= 0)){
      throw new UserInputError('One or more arguments are invalid.')
    }
    const loanModel = this.store.models.loan
    return loanModel.create({
      description, value, lendDate, promisedDate, borrowerId, lenderId: user.id
    }, {
        returning: true
    })
  }

  approveLoan(loanId, user){
    this.errorOnUnauth(user)
    if (!(loanId >= 0)){
      throw new UserInputError('You must specify a loan id.')
    }
    const loanModel = this.store.models.loan
    const userModel = this.store.models.user
    return loanModel.update({
      acceptedDate: Sequelize.fn('NOW')
    }, {
      where: {
        id: loanId,
        borrowerId: user.id,
        acceptedDate: null
      },
      include: [
        {
          model: userModel,
          as: 'lender'
        }
      ],
      returning: true
    })
  }

  completeLoan(loanId, user){
    this.errorOnUnauth(user)
    if (!(loanId >= 0)){
      throw new UserInputError('You must specify a loan id.')
    }
    const loanModel = this.store.models.loan
    const userModel = this.store.models.user
    return loanModel.update({
      returnDate: Sequelize.fn('NOW')
    }, {
      where: {
        id: loanId,
        lenderId: user.id,
        acceptedDate: {
          [Sequelize.Op.ne]: null
        },
        returnDate: null
      },
      include: [
        {
          model: userModel,
          as: 'borrower'
        }
      ],
      returning: true
    })
  }

  async signup(email, name, password, ctx){
    if (email === null || email === undefined ||
      name === null || name === undefined ||
      password === null || password === undefined){
      throw new UserInputError(
        'Email, name, and password are all required to sign up.'
        )
    }
    const userModel = this.store.models.user
    try {
      const user = await userModel.create({
        email, name, password
      }, {
        returning: true
      })
      ctx.login(user)
      return user
    }
    catch (err){
      if (err.name === 'SequelizeUniqueConstraintError'){
          throw new ApolloError('User already exists.')
      }
      else {
          throw new ApolloError('Database error.')
      }
    }
  }
}

module.exports = Psql
