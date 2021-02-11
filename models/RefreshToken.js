import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	userId: {
		type: Types.ObjectId,
		ref: 'Author',
		required: true
	},
	refreshToken: {
		type: String,
		required: true
	},
	expiresIn: {
		type: String,
		required: true
	}
})

export default model('refresh_token', schema)