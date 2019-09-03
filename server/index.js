const { ApolloServer } = require('apollo-server-koa')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const psqlStore = require('./db')
const PsqlDataSource = require('./datasources/psql')
const koaApp = require('./koa')

const PORT = 3000

const dataSources = () => ({
  psql: new PsqlDataSource({ store: psqlStore})
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources
})

server.applyMiddleware({ app: koaApp })

if (process.env.NODE_ENV !== 'test'){
  koaApp
    .listen({ port: PORT },
      () => console.log(`🚀 app running on port ${PORT}`))
}
