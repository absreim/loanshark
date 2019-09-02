const passport = require('koa-passport')
const { AuthenicationError } = require('apollo-server-koa')

const resolvers = {
  Query: {
    pendingBorrowingLoans: (_, __, { dataSources, ctx }) => (
      dataSources.psql.getLoans(
        dataSources.psql.PENDING,
        dataSources.psql.BORROWING,
        ctx.state.user
      )
    ),
    pendingLendingLoans: (_, __, { dataSources, ctx }) => (
      dataSources.psql.getLoans(
        dataSources.psql.PENDING,
        dataSources.psql.LENDING,
        ctx.state.user
      )
    ),
    outstandingBorrowingLoans: (_, __, { dataSources, ctx }) => (
      dataSources.psql.getLoans(
        dataSources.psql.OUTSTANDING,
        dataSources.psql.BORROWING,
        ctx.state.user
      )
    ),
    outstandingLendingLoans: (_, __, { dataSources, ctx}) => (
      dataSources.psql.getLoans(
        dataSources.psql.OUTSTANDING,
        dataSources.psql.LENDING,
        ctx.state.user
      )
    ),
    completedBorrowingLoans: (_, __, { dataSources, ctx }) => (
      dataSources.psql.getLoans(
        dataSources.psql.COMPLETED,
        dataSources.psql.BORROWING,
        ctx.state.user
      )
    ),
    completedLendingLoans: (_, __, { dataSources, ctx }) => {
      dataSources.psql.getLoans(
        dataSources.psql.COMPLETED,
        dataSources.psql.LENDING,
        ctx.state.user
      )
    },
    me: (_, __, { ctx }) => ctx.state.user
  },
  Mutation: {
    createLoan: (_, { description, value, lendDate,
        promisedDate, borrowerId }, { dataSources, ctx }) => (
      dataSources.psql.createLoan(
        description, value, lendDate, promisedDate, borrowerId, ctx.state.user
        )
    ),
    approveLoan: (_, { loanId }, { dataSources, ctx }) => (
      dataSources.psql.approveLoan(loanId, ctx.user)
    ),
    completeLoan: (_, { loanId }, { dataSources, ctx }) => (
      dataSources.psql.completeLoan(loanId, ctx.user)
    ),
    logout: (_, __, { ctx }) => {
      ctx.logout()
      return true
    },
    login: (_, { username, password }, { ctx }) => {
      ctx.body.username = username
      ctx.body.password = password
      return new Promise((resolve, reject) => {
        passport.authenticate('local', function(__, user) {
          if (user === false) {
            reject(new AuthenicationError('Wrong username/password combination.'))
          } else {
            ctx.body = user
            resolve(ctx.login(user))
          }
        })(ctx)
      })
    }
  }
}

module.exports = resolvers
