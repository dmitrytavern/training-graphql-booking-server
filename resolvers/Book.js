import getSelectedFields from '../utils/getSelectedFields'
import { ApolloError } from 'apollo-server'

export default {
	Book: {
		owner: async (root, args, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.AuthorModel
				.findById(root.owner)
				.select(fields)
				.lean()
		}
	},

	Query: {
		privateBooks: async (root, { ownerId }, { db, auth }, info) => {
			await auth.verify()

			const fields = getSelectedFields(info)

			return db.BookModel
				.find({ owner: ownerId })
				.select(fields)
				.lean()
		},

		books: async (root, { ownerId }, { db }, info) => {
			const fields = getSelectedFields(info)
			const filter = { status: 'published' }
			if (ownerId) filter.owner = ownerId

			return db.BookModel
				.find(filter)
				.select(fields)
				.lean()
		},

		book: async (root, { id }, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.BookModel
				.findById(id)
				.select(fields)
				.lean()
		},
	},

	Mutation: {
		async addBook(_, {title, status}, {db, auth}) {
			try {
				const { id } = await auth.verify()

				// Checking author exists
				const existsAuthor = await db.AuthorModel.exists({_id: id})

				if (!existsAuthor) {
					return new ApolloError("Author not exists", "400", {
						message: {}
					})
				}

				// Adding new book
				const newBook = new db.BookModel({
					title,
					status,
					owner: id,
					reviews: 0
				})

				const res = await newBook.save()
				const book = await res.populate('owner').execPopulate()


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
				return await db.BookModel.findByIdAndUpdate(id, {
					title,
					status
				}, {
					upsert: true,
					new: true
				})
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},
	}
}