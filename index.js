const mongoose = require('mongoose')
const { ApolloServer, ApolloError, gql, PubSub, withFilter } = require('apollo-server')
const getMongooseSelectedFields = require('./utils/getMongooseSelectedFields')

const BookModel = require('./models/Books')
const AuthorModel = require('./models/Author')

const ADDED_NEW_BOOK = 'ADDED_NEW_BOOK'
const CHAT_CHANNEL_SUBSCRIPTION = 'CHAT_CHANNEL_SUBSCRIPTION'

const typeDefs = gql`
	type Message {
		success: Boolean
	}

	type Book {
		_id: String
		title: String
		reviews: String
		owner: Author
	}

	type Author {
		_id: String
		name: String
		email: String
		books: [Book]
	}

	type Subscription {
	  updatedBookReview(id: String): Book
	  addedBook: Book
	}

	type Mutation {
	  addBook(title: String, owner: String): Book
	  deleteBook(id: String): Message
	  updateBook(id: String, title: String): Message
	  updateBookReview(id: String): Message

    addAuthor(name: String, email: String): Author
	  deleteAuthor(id: String): Message
	  updateAuthor(id: String, name: String): Message
	}

	type Query {
		books: [Book]
		book(id: String): Book
		author(id: String): Author
		authors: [Author]
	}
`;

const resolvers = {
	Author: {
		books({ id }, args, context, info) {
			const fields = getMongooseSelectedFields(info)
			return BookModel.find({ owner: id }).select(fields).lean()
		}
	},

	Book: {
		owner(root, args, context, info) {
			const fields = getMongooseSelectedFields(info)
			return AuthorModel.findById(root).select(fields).lean()
		}
	},

	Query: {
		authors: (root, args, context, info) => {
			const fields = getMongooseSelectedFields(info)
			return AuthorModel.find({}).select(fields).lean()
		},

		author: (root, { id }, context, info) => {
			const fields = getMongooseSelectedFields(info)
			return AuthorModel.findById(id).select(fields).lean()
		},

		books: (root, args, context, info) => {
			const fields = getMongooseSelectedFields(info)
			return BookModel.find({}).select(fields).lean()
		},

		book: (root, { id }, context, info) => {
			const fields = getMongooseSelectedFields(info)
			return BookModel.findById(id).select(fields).lean()
		}
	},
	Mutation: {
		/*
		* Authors
		* */
		async addAuthor(_, { name, email }) {
			try {
				const newUser = new AuthorModel({
					name,
					email,
				})

				await newUser.save()

				return newUser
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async deleteAuthor(_, { id }) {
			try {
				await AuthorModel.findByIdAndDelete(id)

				await BookModel.deleteMany({
					owner: id
				})

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async updateAuthor(_, { id, name }) {
			try {
				await AuthorModel.findByIdAndUpdate(id, {
					name
				}, {
					upsert: true
				})

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},


		/*
		*  Books
		* */
		async addBook(_, { title, owner }, { pubsub }) {
			try {

				// Checking author exists
				const existsAuthor = await AuthorModel.exists({ _id: owner })

				if (!existsAuthor) {
					return new ApolloError("Author not exists", "400", {
						message: {}
					})
				}

				// Adding new book
				const newBook = new BookModel({
					title,
					owner,
					reviews: 0
				})

				const res = await newBook.save()
				const book = await res.populate('owner').execPopulate()

				pubsub.publish(ADDED_NEW_BOOK, { addedBook: book })

				// Update author, adding new book
				await AuthorModel.findByIdAndUpdate(book.owner._id, {
					$push: {
						books: book._id
					}
				}, {
					new: true
				})

				return book
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async deleteBook(_, { id }) {
			try {
				const book = await BookModel
					.findById(id)
					.populate('owner', "_id")

				await AuthorModel.findByIdAndUpdate(book.owner._id , {
					$pull: { books: id }
				})

				await book.remove()

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async updateBook(_, { id, title}) {
			try {
				await BookModel.findByIdAndUpdate(id, {
					title
				}, {
					upsert: true
				})

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async updateBookReview(_, { id }, { pubsub }) {
			try {
				const book = await BookModel.findByIdAndUpdate(id, {
					$inc: {
						reviews: 1
					}
				}, {
					new: true
				})

				pubsub.publish(CHAT_CHANNEL_SUBSCRIPTION, { updatedBookReview: book })

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		}
	},

	Subscription: {
		addedBook: {
			subscribe (_, _1, { pubsub }) {
				return pubsub.asyncIterator(ADDED_NEW_BOOK)
			}
		},

		updatedBookReview: {
			subscribe: withFilter((_, _1, {pubsub}) => {
				return pubsub.asyncIterator(CHAT_CHANNEL_SUBSCRIPTION)
			}, (payload, variables) => {
				const bookId = payload.updatedBookReview._id.toString()
				const id = variables.id.toString()

				return bookId === id
			})
 		}
	}
}


async function start() {

	try {
		await mongoose.connect('mongodb://node_user:root@localhost:27017/node', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})

		mongoose.set('debug', true)

		const pubsub = new PubSub()
		const server = new ApolloServer({ typeDefs, resolvers, context: { pubsub } })

		server.listen().then(({url, subscriptionsUrl}) => {
			console.log('Server ready on ' + url)
			console.log('Server sub ' + subscriptionsUrl)
		})
	} catch (e) {
		console.log('Server error', e)
		process.exit(1)
	}
}

start()
