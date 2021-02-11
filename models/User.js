import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	authorId: {
		type: Types.ObjectId,
		ref: 'author'
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
})

export default model('user', schema)