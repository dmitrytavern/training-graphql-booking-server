const { Schema, model, Types } = require('mongoose')

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
	books: [{
		type: Types.ObjectId,
		ref: 'Book'
	}]
})

module.exports = model('Author', schema)