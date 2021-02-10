import { useHistory } from 'react-router-dom'
import { ApolloLink } from "@apollo/client"
import jwtDecode from "jwt-decode"
import * as Requests from "../../api/auth.api"

let token = null
let startGettingNewToken = false

const useApolloAuth = (client) => {
	const history = useHistory()

	/**
	 *  Register request
	 *  Sending data to server, where we create new user
	 *  and return token with user data
	 * */
	const register = async (variables) => {
		try {
			const { data } = await client.mutate({
				mutation: Requests.AUTH_REGISTRATION_MUTATION,
				variables
			})

			const { token: newToken, ...other } = data.register

			token = newToken

			return other
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error logout')
		}
	}


	/**
	 *  Login request
	 *  Sending auth-data to server and get
	 *  auth token and user data
	 * */
	const login = async (variables) => {
		try {
			const {data} = await client.mutate({
				mutation: Requests.AUTH_LOGIN_MUTATION,
				variables
			})

			const { token: newToken, ...other } = data.login

			token = newToken

			return other
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error login')
		}
	}


	/**
	 *  Auto login
	 *  Sending request for get access token if refresh token
	 *  is valid
	 * */
	const autoLogin = async () => {
		try {
			const { data } = await client.mutate({
				mutation: Requests.AUTH_AUTO_LOGIN_MUTATION
			})

			const { token: newToken, ...other } = data.autoLogin

			token = newToken

			return other
		} catch (e) {
			throw new Error('[Auth]: Error login with refresh token')
		}
	}


	/**
	 *  Refresh request
	 *  Sending request on refresh auth token
	 * */
	const refresh = async () => {
		try {
			const {data} = await client.mutate({
				mutation: Requests.AUTH_REFRESH_TOKEN_MUTATION
			})

			token = data.refreshToken.token
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error refresh token')
		}
	}


	/**
	 *  Logout
	 *  Sending request on logout user. Deleting
	 *  refresh tokens from database end close session
	 * */
	const logout = async () => {
		try {
			await client.mutate({
				mutation: Requests.AUTH_LOGOUT_MUTATION
			})
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error logout')
		}
	}


	/**
	 *  Checks tokens
	 *  Checks expires of access token. If date > exp time
	 *  we sending request on refresh token. If happens error with
	 *  auth we redirect user on auth page.
	 *
	 *  If something happens( invalid token, error from server )
	 *  we redirect user on auth page
	 * */
	const refreshChecking = async () => {
		try {
			if (token !== null) {
				const { exp } = await jwtDecode(token)

				if (Date.now() >= (exp * 1000) - 5 && !startGettingNewToken) {

						startGettingNewToken = true

						await refresh().then(() => {
							startGettingNewToken = false
						})
				}
			}
		} catch (e) {
			history.push('/auth/login')
		}
	}


	/**
	 *  Create apollo middleware for setting headers for
	 *  authorization users
	 * */
	const middleware = new ApolloLink(async (operation, forward) => {
		await refreshChecking()

		operation.setContext({
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:4000',
				authorization: token ? `Bearer ${token}` : '',
			}
		})

		return forward(operation)
	})

	return {
		middleware,
		register,
		login,
		autoLogin,
		logout,
		refresh
	}
}

export default useApolloAuth