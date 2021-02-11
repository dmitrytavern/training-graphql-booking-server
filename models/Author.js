import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	books: [{
		type: Types.ObjectId,
		ref: 'book'
	}]
})

export default model('author', schema)