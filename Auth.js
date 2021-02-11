import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

const SECRET_ACCESS_KEY = 'SECRET'
const SECRET_REFRESH_KEY = 'REFRESH'

export default class Auth {

	// Request from server for getting authorization header
	constructor(request, response, model) {
		this.model = model
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
		try {
			const refreshToken = this.req.cookies.refreshToken || null

			if (this.token === null && refreshToken === null) {
				return new AuthenticationError('AuthenticationError')
			}

			return await jwt.verify(this.token, SECRET_ACCESS_KEY)
		} catch (e) {
			throw new AuthenticationError('AuthenticationError')
		}
	}

	async sign(payload) {
		const oldRefreshToken = this.req.cookies.refreshToken || null
		const expiresInDate = 1000 * 60 * 60 * 24 * 7 // 7 days

		const refresh = await jwt.sign(payload, SECRET_REFRESH_KEY, {
			expiresIn: expiresInDate
		})

		const token = await jwt.sign(payload, SECRET_ACCESS_KEY, {
			expiresIn: 10
		})

		if (oldRefreshToken === null) {
			const refreshToken = new this.model({
				userId: payload.id,
				refreshToken: refresh,
				expiresIn: expiresInDate
			})

			await refreshToken.save()
			console.log('Create refresh token in database')
		} else {
			try {
				await jwt.verify(oldRefreshToken, SECRET_REFRESH_KEY)

				const data = await this.model.findOneAndUpdate({
					refreshToken: oldRefreshToken
				}, {
					userId: payload.id,
					refreshToken: refresh,
					expiresIn: expiresInDate
				})

				if (data === null) {
					await this.logout()
					return new Error('Token not found!')
				}

				console.log('Update refresh token in database')
			} catch (e) {
				await this.logout()
			}
		}

		await this.res.cookie('refreshToken', refresh, {
			httpOnly: true,
			path: '/',
			sameSite: true,
			maxAge: expiresInDate
		})

		console.log('Created new token: ', token)
		console.log('Created new refresh token: ', refresh)
		return token
	}

	async refresh(refreshToken) {
		try {
			const token = refreshToken || this.req.cookies.refreshToken || null

			if (token === null) return new AuthenticationError('AuthenticationError')

			const dbToken = await this.model.find({ refreshToken: token })

			if (dbToken === null)  return new AuthenticationError('AuthenticationError')

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
			throw new AuthenticationError('AuthenticationError')
		}
	}

	async logout() {
		try {
			const oldRefreshToken = this.req.cookies.refreshToken || null

			if (oldRefreshToken) {
				await this.model.findOneAndDelete({
					refreshToken: oldRefreshToken
				})
			}

			await this.res.clearCookie('refreshToken')

			console.log('Delete refresh token from database and cookie')
		} catch (e) {
			throw new AuthenticationError('AuthenticationError')
		}
	}
}