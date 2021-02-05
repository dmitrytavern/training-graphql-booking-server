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
	owner: {
		type: Types.ObjectId,
		ref: 'Author'
	}
})

export default model('Book', schema)