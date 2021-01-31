const graphqlFields = require('graphql-fields')

module.exports = function getMongooseSelectedFields (info, fieldPath = null) {
	const selections = graphqlFields(info)
	const mongooseSelection = Object
		.keys(fieldPath ? selections[fieldPath] : selections)
		.reduce((a, b) => ({ ...a, [b]: 1   }), {})

	return mongooseSelection
}