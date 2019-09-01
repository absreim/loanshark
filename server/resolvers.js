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
    completedBorrowingLoans: (_, __, { dataSources, ctx}) => (
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
    
  }
}

module.exports = resolvers
