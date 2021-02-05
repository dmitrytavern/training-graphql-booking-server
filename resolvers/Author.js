import getSelectedFields from '../utils/getSelectedFields'
import { ApolloError } from 'apollo-server'

export default {
	Author: {
		books: async (root, args, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.BookModel.find({ owner: root._id }).select(fields).lean()
		}
	},

	Query: {
		authors: async (root, args, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.AuthorModel.find({}).select(fields).lean()
		},

		author: async (root, { id }, { db }, info) => {
			const fields = getSelectedFields(info)
			return db.AuthorModel.findById(id).select(fields).lean()
		},
	},

	Mutation: {
		async addAuthor(_, { name, email }, { db }) {
			try {
				const newUser = new db.AuthorModel({
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

		async deleteAuthor(_, { id }, { db }) {
			try {
				await db.AuthorModel.findByIdAndDelete(id)

				await db.BookModel.deleteMany({
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

		async updateAuthor(_, { id, name }, { db }) {
			try {
				await db.AuthorModel.findByIdAndUpdate(id, {
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
	}
}