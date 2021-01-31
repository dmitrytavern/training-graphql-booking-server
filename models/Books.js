const { Schema, model, Types } = require('mongoose')

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

module.exports = model('Book', schema)