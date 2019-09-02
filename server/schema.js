const { gql } = require('apollo-server-koa')

const typeDefs = gql`
  type Query {
    pendingBorrowingLoans: [Loan]!
    pendingLendingLoans: [Loan]!
    outstandingBorrowingLoans: [Loan]!
    outstandingLendingLoans: [Loan]!
    completedBorrowingLoans: [Loan]!
    completedOutstandingLoans: [Loan]!
    me: User
  }

  type Mutation {
    createLoan(description: String!, value: Int!, lendDate: String!,
      promisedDate: String!, borrowerId: Int!): Loan
    approveLoan(loanId: Int!): Loan
    completeLoan(loanId: Int!): Loan
    login(email: String!, password: String!): User
    logout: Boolean
    signup(email: String!, password: String!, name: String!): User
  }

  type User {
    id: Int!
    email: String!
    name: String!
  }

  type Loan {
    id: Int!
    lender: User!
    borrower: User!
    description: String!
    imageName: String
    value: Int!
    lendDate: String!
    promisedDate: String!
    acceptedDate: String
    returnDate: String
  }
`

module.exports = typeDefs
