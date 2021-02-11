import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	title: {
		type: String,
		required: true
	},
	reviews: {
		type: Number,
		required: true,
		unique: false
	},
	status: {
		type: String,
		required: true,
	},
	owner: {
		type: Types.ObjectId,
		ref: 'author'
	}
})

export default model('book', schema)