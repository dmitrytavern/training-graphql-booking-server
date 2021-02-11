export const types = `
	type AuthCallbackMutation {
		token: String
		author: Author
	}
	
	type AuthRefreshToken {
		token: String
		author: Author
	}
`

export const queries = ``

export const mutations = `
	register(name: String, email: String, password: String): AuthCallbackMutation

	login(email: String, password: String): AuthCallbackMutation

	autoLogin(void: String): AuthCallbackMutation

	refreshToken(oldToken: String): AuthRefreshToken

	logout(void: String): Boolean

	remove(void: String): Boolean
`
