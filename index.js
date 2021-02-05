import mongoose from 'mongoose'
import { ApolloServer, PubSub } from "apollo-server"

import typeDefs from './schema'
import resolvers from './resolvers'

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

		const pubsub = new PubSub()
		const server = new ApolloServer({
			typeDefs,
			resolvers,
			context: {
				pubsub,
				db: {
					BookModel,
					AuthorModel
				}
			}
		})

		await server
			.listen()
			.then(({url, subscriptionsUrl}) => {
			console.log('[APP]: Server ready on ' + url)
			console.log('[APP]: Server subscriptions url: ' + subscriptionsUrl)
		})
	} catch (e) {
		console.log('Server error', e)
		process.exit(1)
	}
}

start()
	.then(() => {
	console.log('[APP]: Application started')
})
