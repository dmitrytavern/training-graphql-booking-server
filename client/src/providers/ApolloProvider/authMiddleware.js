import { ApolloLink } from "@apollo/client"
import jwtDecode from "jwt-decode"
import * as Requests from "../../api/auth.api"

let token = null
let startGettingNewToken = false

const useApolloAuth = (client) => {

	/**
	 *  Login request
	 *  Sending auth-data to server and get
	 *  auth token and user data
	 * */
	const login = async (variables) => {
		const { data } = await client.mutate({
			mutation: Requests.AUTH_LOGIN_MUTATION,
			variables
		})

		const { author, token: newToken } = data.login

		token = newToken

		return author
	}


	/**
	 *  Auto login
	 *  Sending request for get access token if refresh token
	 *  is valid
	 * */
	const autoLogin = async () => {
		const { data } = await client.mutate({
			mutation: Requests.AUTH_AUTO_LOGIN_MUTATION
		})

		const { author, token: newToken } = data.autoLogin

		token = newToken

		return author
	}


	/**
	 *  Refresh request
	 *  Sending request on refresh auth token
	 * */
	const refresh = async () => {
		const { data } = await client.mutate({
			mutation: Requests.AUTH_REFRESH_TOKEN_MUTATION
		})

		token = data.refreshToken.token
	}


	/**
	 *  Logout
	 *  Sending request on logout user. Deleting
	 *  refresh tokens from database end close session
	 * */
	const logout = async () => {
		await client.mutate({
			mutation: Requests.AUTH_LOGOUT_MUTATION
		})
	}


	/**
	 *  Checks tokens
	 *  Checks expires of access token. If date > exp time
	 *  we sending request on refresh token. If happens error with
	 *  auth we redirect user on auth page
	 * */
	const refreshChecking = async () => {
		if (token !== null) {
			const payload = await jwtDecode(token)

			if (Date.now() >= (payload.exp * 1000) - 5 && !startGettingNewToken) {
				try {
					startGettingNewToken = true

					await refresh().then(() => {
						startGettingNewToken = false
					})
				} catch (e) {
					window.location = '/auth'

					throw 'Redirect'
				}
			}
		}
	}


	/**
	 *  Create apollo middleware for setting headers for
	 *  authorization users
	 * */
	const middleware = new ApolloLink((operation, forward) => {
		return refreshChecking().then(() => {
			operation.setContext({
				headers: {
					'Access-Control-Allow-Origin': 'http://localhost:4000',
					authorization: token ? `Bearer ${token}` : '',
				}
			})

			return forward(operation)
		})
	})

	return {
		middleware,
		login,
		autoLogin,
		logout,
		refresh
	}
}

export default useApolloAuth