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
	}
}