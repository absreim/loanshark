const resolvers = {
  Query: {
    pendingBorrowingLoans: (_, __, { dataSources, ctx }) =>
      dataSources.psql.getPendingBorrowingLoansForUser(
        ctx.state.user.id
      ),
    pendingLendingLoans: (_, __, { dataSources, ctx }) =>
      dataSources.psql.getPendingLendingLoansForUser(
        ctx.state.user.id
      ),
    outstandingBorrowingLoans: (_, __, { dataSources, ctx }) =>
      dataSources.psql.getOutstandingBorrowingLoans(
        ctx.state.user.id
      ),
    me: (_, __, { ctx }) => ctx.state.user
  }
}

module.exports = resolvers
