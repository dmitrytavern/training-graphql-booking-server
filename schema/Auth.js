export const types = `
	type AuthCallbackMutation {
		token: String
		author: Author
	}
`

export const queries = ``

export const mutations = `
	login(email: String, password: String): AuthCallbackMutation
	register(name: String, email: String, password: String): AuthCallbackMutation
`
