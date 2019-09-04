const passport = require('koa-passport')

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
    completedLendingLoans: (_, __, { dataSources, ctx }) => (
      dataSources.psql.getLoans(
        dataSources.psql.COMPLETED,
        dataSources.psql.LENDING,
        ctx.state.user
      )
    ),
    me: (_, __, { ctx }) => {
      return ctx.state.user
    }
  },
  Mutation: {
    createLoan: (_, { description, value, lendDate,
        promisedDate, borrowerId }, { dataSources, ctx }) => (
      dataSources.psql.createLoan(
        description, value, lendDate, promisedDate, borrowerId, ctx.state.user
        )
    ),
    approveLoan: (_, { loanId }, { dataSources, ctx }) => (
      dataSources.psql.approveLoan(loanId, ctx.state.user)
    ),
    completeLoan: (_, { loanId }, { dataSources, ctx }) => (
      dataSources.psql.completeLoan(loanId, ctx.state.user)
    ),
    logout: (_, __, { ctx }) => {
      ctx.logout()
      return true
    },
    login: (_, { email, password }, { ctx }) => {
      ctx.request.body.username = email
      ctx.request.body.password = password
      return new Promise((resolve, reject) => {
        passport.authenticate('local', function(err, user) {
          if (user === false) {
            reject(err)
          } else {
            ctx.login(user, function(innerErr) {
              if (innerErr){
                reject(innerErr)
              }
              resolve(user)
            })
          }
        })(ctx)
      })
    },
    signup: (_, { email, name, password }, { dataSources, ctx }) => (
      dataSources.psql.signup(email, name, password, ctx)
    )
  }
}

module.exports = resolvers
