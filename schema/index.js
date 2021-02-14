import * as Auth from "./Auth"
import * as Book from "./Book"
import * as Author from './Author'

const types = []
const queries = []
const mutations = []
const subscriptions = []

const schemas = [
	Auth,
	Book,
	Author
]

schemas.forEach(schema => {
	if (schema.types) types.push(schema.types)
	if (schema.queries) queries.push(schema.queries)
	if (schema.mutations) mutations.push(schema.mutations)
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
`