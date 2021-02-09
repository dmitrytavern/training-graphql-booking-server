import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

const SECRET_ACCESS_KEY = 'SECRET'
const SECRET_REFRESH_KEY = 'REFRESH'

export default class Auth {

	// Request from server for getting authorization header
	constructor(request, response) {
		this.req = request
		this.res = response

		const authHeader = this.req.headers.authorization || ''
		if (authHeader === '') {
			this.token = null
		} else {
			this.token = authHeader.split(' ')[1]
		}
	}

	async verify() {
		const refreshToken = this.req.cookies.refreshToken || null

		if (this.token === null && refreshToken === null) {
			// ERROR AUTH
			return {
				verify: false,
				data: {}
			}
		}

		return await jwt.verify(this.token, SECRET_ACCESS_KEY, (err, decoded) => {
			if (!err) {
				return {
					verify: true,
					data: decoded
				}
			}

			return {
				verify: false,
				data: {}
			}
		})
	}

	async sign(payload) {
		const refresh = await jwt.sign(payload, SECRET_REFRESH_KEY, {
			expiresIn: '7d'
		})

		const token = await jwt.sign(payload, SECRET_ACCESS_KEY, {
			expiresIn: 10
		})

		await this.res.cookie('refreshToken', refresh, {
			httpOnly: true,
			path: '/',
			sameSite: true,
			maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
		})

		console.log('Created new token: ', token)
		console.log('Created new refresh token: ', refresh)
		return token
	}

	async refresh(refreshToken) {
		try {
			const token = refreshToken || this.req.cookies.refreshToken || null

			const payload = await jwt.verify(token, SECRET_REFRESH_KEY)

			delete payload.iat
			delete payload.exp
			delete payload.nbf
			delete payload.jti

			return {
				payload,
				token: await this.sign(payload)
			}
		} catch (e) {
			return new AuthenticationError('AuthenticationError')
		}
	}

	async logout() {
		try {
			await this.res.clearCookie('refreshToken')
		} catch (e) {
			return new AuthenticationError('AuthenticationError')
		}
	}
}