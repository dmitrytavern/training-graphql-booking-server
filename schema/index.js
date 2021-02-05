import * as Book from "./Book"
import * as Author from './Author'

const types = []
const queries = []
const mutations = []
const subscriptions = []

const schemas = [
	Book,
	Author
]

schemas.forEach(schema => {
	if (schema.types) types.push(schema.types)
	if (schema.queries) queries.push(schema.queries)
	if (schema.mutations) mutations.push(schema.mutations)
	if (schema.subscriptions) subscriptions.push(schema.subscriptions)
})

export default `
	type Message {
		success: Boolean
	}

	${types.join('\n')}

	type Query {
		${queries.join('\n')}
	}
	
	type Mutation {
		${mutations.join('\n')}
	}

	type Subscription {
		${subscriptions.join('\n')}
	}
`