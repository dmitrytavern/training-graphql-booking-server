import getSelectedFields from '../utils/getSelectedFields'
import { ApolloError, withFilter } from 'apollo-server'

const ADDED_NEW_BOOK = 'ADDED_NEW_BOOK'
const CHAT_CHANNEL_SUBSCRIPTION = 'CHAT_CHANNEL_SUBSCRIPTION'

export default {
	Book: {
		owner: async (root, args, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.AuthorModel.findById(root.owner).select(fields).lean()
		}
	},

	Query: {
		books: async (root, { ownerId }, { db, auth }, info) => {
			const fields = getSelectedFields(info)
			const filter = {}
			if (ownerId) filter.owner = ownerId

			const { data } = await auth.verify()
			if (data.id !== ownerId) filter.status = 'published'

			return db.BookModel.find(filter).select(fields).lean()
		},

		book: async (root, { id }, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.BookModel.findById(id).select(fields).lean()
		},
	},

	Mutation: {
		async addBook(_, {title, owner, status}, {pubsub, db}) {
			try {

				// Checking author exists
				const existsAuthor = await db.AuthorModel.exists({_id: owner})

				if (!existsAuthor) {
					return new ApolloError("Author not exists", "400", {
						message: {}
					})
				}

				// Adding new book
				const newBook = new db.BookModel({
					title,
					owner,
					status,
					reviews: 0
				})

				const res = await newBook.save()
				const book = await res.populate('owner').execPopulate()

				pubsub.publish(ADDED_NEW_BOOK, {addedBook: book})

				// Update author, adding new book
				await db.AuthorModel.findByIdAndUpdate(book.owner._id, {
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

		async deleteBook(_, {id}, {db}) {
			try {
				const book = await db.BookModel
					.findById(id)
					.populate('owner', "_id")

				await db.AuthorModel.findByIdAndUpdate(book.owner._id, {
					$pull: {books: id}
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

		async updateBook(_, {id, title, status}, { db }) {
			try {
				await db.BookModel.findByIdAndUpdate(id, {
					title,
					status
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

		async updateBookReview(_, {id}, {pubsub, db}) {
			try {
				const book = await db.BookModel.findByIdAndUpdate(id, {
					$inc: {
						reviews: 1
					}
				}, {
					new: true
				})

				pubsub.publish(CHAT_CHANNEL_SUBSCRIPTION, {updatedBookReview: book})

				return {
					success: true
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},
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