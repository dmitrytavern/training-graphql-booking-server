import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ApolloLink } from "@apollo/client"
import jwtDecode from "jwt-decode"
import createApolloClient from "../ApolloProvider/createApolloClient"
import * as Requests from "../../api/auth.api"

let token = null
let refreshTokenRequestSent = false
const checkingAccessExpired = async () => {
	const { exp } = await jwtDecode(token)
	return Date.now() >= (exp * 1000) - 5
}

const useApolloAuth = () => {
	const history = useHistory()

	/**
	 *  Make request for refresh token
	 * */
	const requestRefreshToken = async (client) => {
		try {
			refreshTokenRequestSent = true

			const { data } = await client.mutate({
				mutation: Requests.AUTH_REFRESH_TOKEN_MUTATION
			})

			token = data.refreshToken.token

			refreshTokenRequestSent = false
		} catch (e) {
			refreshTokenRequestSent = false
			console.error(e)
			throw new Error('[Auth]: Error refresh token')
		}
	}


	/**
	 *  Checks tokens
	 *  Checks expires of access token. If date > exp time
	 *  function sending request on refresh token. If happens error with
	 *  auth function redirect user on auth page.
	 *
	 *  If something happens( invalid token, error from server )
	 *  function redirect user on auth page
	 * */
	const refreshChecking = useCallback(async (client) => {
		try {
			if (token !== null) {
				const expired = await checkingAccessExpired()

				if (expired && !refreshTokenRequestSent) {
					await requestRefreshToken(client)
						.catch(() => {
							history.push('/auth/logout', {
								makeRequest: false
							})
						})
				}
			}
		} catch (e) {
			history.push('/auth')
		}
	}, [history])


	/**
	 *  Create apollo middleware for setting headers for
	 *  authorization users
	 * */
	const middleware = new ApolloLink(async (operation, forward) => {
		await refreshChecking(client)

		operation.setContext({
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:4000',
				authorization: token ? `Bearer ${token}` : '',
			}
		})

		return forward(operation)
	})


	/**
	 *  Create new client for hook
	 * */
	const client = createApolloClient([middleware])


	/* Actions */

	/**
	 *  Register request
	 *  Sending data to server and create new user
	 *  and returns token with user data
	 * */
	const register = useCallback(async (variables) => {
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
	}, [client])


	/**
	 *  Login request
	 *  Sending auth-data to server and get
	 *  auth token and user data
	 * */
	const login = useCallback(async (variables) => {
		try {
			const { data } = await client.mutate({
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
	}, [client])


	/**
	 *  Auto login
	 *  Sending request for get access token if refresh token
	 *  is valid
	 * */
	const autoLogin = useCallback(async () => {
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
	}, [client])


	/**
	 *  Refresh request
	 *  Sending refresh auth token request
	 * */
	const refresh = useCallback(async () => {
		try {
			await requestRefreshToken(client)
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error refresh token')
		}
	}, [client])


	/**
	 *  Logout
	 *  Sending logout user request. Deleting
	 *  refresh tokens from database end close session
	 * */
	const logout = useCallback(async () => {
		try {
			await client.mutate({
				mutation: Requests.AUTH_LOGOUT_MUTATION
			})
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error logout')
		}
	}, [client])


	/**
	 *  Remove account
	 *  Sending remove user request
	 * */
	const remove = useCallback(async () => {
		try {
			await client.mutate({
				mutation: Requests.AUTH_REMOVE_ACCOUNT_MUTATION
			})
		} catch (e) {
			console.error(e)
			throw new Error('[Auth]: Error remove')
		}
	}, [client])


	return {
		middleware,
		actions: {
			register,
			login,
			autoLogin,
			logout,
			refresh,
			remove
		}
	}
}

export default useApolloAuth
