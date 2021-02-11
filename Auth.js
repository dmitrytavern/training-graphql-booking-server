import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

const COOKIE_REFRESH_TOKEN_NAME = 'refreshToken'
const EXPIRES_IN_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 7 // 7 days
const EXPIRES_IN_ACCESS_TOKEN = 10 // 900 - 15 min
const SECRET_ACCESS_KEY = 'SECRET'
const SECRET_REFRESH_KEY = 'REFRESH'

const signDefaultOptions = {
	databaseCheck: true
}

export default class Auth {
	constructor(model) {
		this.model = model
	}

	/**
	 *  Setting request and response vars from
	 *  apollo context. Getting tokens.
	 * */
	async setData(request, response) {
		this.req = request
		this.res = response

		this.refreshToken = this.req.cookies[COOKIE_REFRESH_TOKEN_NAME] || null

		const authHeader = this.req.headers.authorization || ''
		if (authHeader === '') {
			this.token = null
		} else {
			this.token = authHeader.split(' ')[1]
		}
	}


	/**
	 *  Main verify function.
	 *
	 *  Checking refresh token on exists and verify access token.
	 *  If has error - throw auth error
	 * */
	async verify() {
		try {
			if (this.token === null && this.refreshToken === null) {
				return new AuthenticationError('AuthenticationError')
			}

			return await jwt.verify(this.token, SECRET_ACCESS_KEY)
		} catch (e) {
			console.error(e)
			throw new AuthenticationError('AuthenticationError')
		}
	}


	/**
	 *  Main sign function.
	 *
	 *  Generates new tokens, check refresh token in database(add or update)
	 *  and set refresh token in cookie
	 * */
	async sign(payload, options = {}) {
		try {
			const opt = Object.assign({}, signDefaultOptions, options)

			const { token, refreshToken } = await this.generateTokens(payload)

			if (opt.databaseCheck) {
				await this.checkDatabaseRefreshToken({
					payload,
					newToken: refreshToken
				})
			}

			await this.setCookie(refreshToken)

			return {
				token,
				refreshToken
			}
		} catch (e) {
			await this.logout()
			throw new AuthenticationError('AuthenticationError')
		}
	}


	/**
	 *  Main refresh token function
	 *
	 *  Check old refresh token.
	 *  If old token not exists or it is not valid - throw error and logout.
	 *  If old token refresh is valid - create new tokens, update token in database and cookies.
	 * */
	async refresh() {
		try {
			const oldRefreshToken = this.refreshToken

			if (oldRefreshToken === null) throw new AuthenticationError('AuthenticationError')

			const payload = await jwt.verify(oldRefreshToken, SECRET_REFRESH_KEY)

			delete payload.iat
			delete payload.exp
			delete payload.nbf
			delete payload.jti

			const { token, refreshToken } = await this.generateTokens(payload)

			await this.databaseUpdateRefreshToken({
				newToken: refreshToken,
				oldToken: oldRefreshToken
			})

			await this.setCookie(refreshToken)

			return {
				payload,
				token
			}
		} catch (e) {
			await this.logout()
			throw new AuthenticationError('AuthenticationError')
		}
	}


	/**
	 *  Main logout function.
	 *
	 *  Remove cookies and remove refresh token in database if exists.
	 * */
	async logout() {
		try {
			const oldRefreshToken = this.refreshToken

			if (oldRefreshToken) {
				await this.model.findOneAndDelete({
					refreshToken: oldRefreshToken
				})
			}

			await this.res.cookie(COOKIE_REFRESH_TOKEN_NAME, '', {
				httpOnly: true,
				path: '/graphql',
				sameSite: true,
				maxAge: 0
			})
		} catch (e) {
			throw new AuthenticationError('AuthenticationError')
		}
	}




	/**
	 *  Function update refresh token in database.
	 *
	 *  If database have not refresh token, function
	 *  throw error.
	 * */
	async databaseUpdateRefreshToken({ newToken, oldToken }) {
		const dbToken = await this.model.findOneAndUpdate({
			refreshToken: oldToken
		}, {
			refreshToken: newToken,
			expiresIn: EXPIRES_IN_REFRESH_TOKEN
		}, {
			new: true
		})

		if (dbToken === null) {
			throw new Error('Token not found!')
		}
	}



	/**
	 *  Create refresh token in database
	 * */
	async databaseCreateRefreshToken({ payload, newToken }) {
		try {
			const refreshToken = new this.model({
				userId: payload.id,
				refreshToken: newToken,
				expiresIn: EXPIRES_IN_REFRESH_TOKEN
			})

			await refreshToken.save()
		} catch (e) {
			throw new AuthenticationError('databaseCreateRefreshToken: Unknown error')
		}
	}



	/**
	 *  Check refresh token in database.
	 *
	 *  If refresh token is not exists - add refresh token in db.
	 *  If refresh token is exists and token is valid - update refresh token in db.
	 *  If refresh token is exists but token not valid - logout user (remove token from db and cookies).
	 * */
	async checkDatabaseRefreshToken({ newToken, payload }) {
		try {
			const oldRefreshToken = this.refreshToken

			if (oldRefreshToken === null) {
				await this.databaseCreateRefreshToken({
					payload,
					newToken
				})
			} else {
					await jwt.verify(oldRefreshToken, SECRET_REFRESH_KEY)

					await this.databaseUpdateRefreshToken({
						newToken,
						oldToken: oldRefreshToken
					})
			}
		} catch (e) {
			await this.logout()
			throw new AuthenticationError('checkDatabaseRefreshToken: Unknown error')
		}
	}



	/**
	 *  Generate tokens
	 *
	 *  Function generates access and refresh tokens without saving in database
	 *  or cookies.
	 * */
	async generateTokens(payload) {
		try {
			const refreshToken = await jwt.sign(payload, SECRET_REFRESH_KEY, {
				expiresIn: EXPIRES_IN_REFRESH_TOKEN
			})

			const token = await jwt.sign(payload, SECRET_ACCESS_KEY, {
				expiresIn: EXPIRES_IN_ACCESS_TOKEN
			})

			return {
				token,
				refreshToken
			}
		} catch (e) {
			throw new AuthenticationError('generateTokens: Unknown error')
		}
	}



	/**
	 *  Set cookies
	 *
	 *  Set refresh token in cookies. Use in sign and refresh functions.
	 * */
	async setCookie(refreshToken) {
		try {
			await this.res.cookie(COOKIE_REFRESH_TOKEN_NAME, refreshToken, {
				httpOnly: true,
				path: '/graphql',
				sameSite: true,
				maxAge: EXPIRES_IN_REFRESH_TOKEN
			})
		} catch (e) {
			throw new AuthenticationError('setCookie: Unknown error')
		}
	}
}