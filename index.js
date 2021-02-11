import mongoose from 'mongoose'
import express from 'express'
import expressCookieParser from 'cookie-parser'
import expressCors from 'cors'
import { createServer } from 'http'
import { ApolloServer, PubSub } from "apollo-server-express"
import Auth from "./Auth"

import typeDefs from './schema'
import resolvers from './resolvers'

import RefreshToken from "./models/RefreshToken"
import BookModel from './models/Books'
import AuthorModel from './models/Author'

async function start() {
	try {
		await mongoose.connect('mongodb://node_user:root@localhost:27017/node', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})

		mongoose.set('debug', true)

		const app = express()
		app.use(expressCookieParser())
		app.use(expressCors({
			origin: 'http://localhost:3000',
			credentials: true,
		}))

		const pubsub = new PubSub()
		const apolloServer = new ApolloServer({
			typeDefs,
			resolvers,
			context: ({ req, res }) => {
				const auth = new Auth(req, res, RefreshToken)

				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

				return {
					auth,
					pubsub,
					db: {
						BookModel,
						AuthorModel,
						RefreshToken
					}
				}
			}
		})

		const httpServer = createServer(app)
		apolloServer.applyMiddleware({ app })
		apolloServer.installSubscriptionHandlers(httpServer)

		httpServer.listen(4000, () => {
			console.log('[APP]: Server ready on http://localhost:4000' + apolloServer.graphqlPath)
			console.log('[APP]: Server subscriptions on ws://localhost:4000' + apolloServer.subscriptionsPath)
		})
	} catch (e) {
		console.log('Server error', e)
		process.exit(1)
	}
}

start().then(() => {})
