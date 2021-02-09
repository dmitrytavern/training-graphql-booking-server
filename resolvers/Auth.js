import { ApolloError } from 'apollo-server'
import bcrypt from 'bcrypt'

export default {
	Mutation: {
		async login(_, { email, password }, { db, auth }) {
			try {
				const author = await db.AuthorModel.findOne({ email })

				if (!author) {
					return new ApolloError("Invalid field", '401', {
						message: 'Not found author.',
					})
				}

				const passwordCompare = await bcrypt.compare(password, author.password)
				if (!passwordCompare) {
					return new ApolloError("Invalid field", '401', {
						message: 'Email or password invalid.',
					})
				}

				const token = await auth.sign({
					id: author._id,
					name: author.name,
					email: author.email
				})

				return {
					token,
					author
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async autoLogin(_, __, { db, auth }) {
			try {
				let { token, payload } = await auth.refresh()

				if (token) {
					const author = await db.AuthorModel.findOne({
						email: payload.email
					})

					return {
						author,
						token
					}
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async register(_, { name, email, password }, { db, auth }) {
			try {
				const existsEmail = await db.AuthorModel.exists({ email })

				if (existsEmail) {
					return new ApolloError("Invalid data", '401', {
						message: 'Author already exists.',
					})
				}


				const hashedPassword = await bcrypt.hash(password, 10)
				const newAuthor = new db.AuthorModel({
					name,
					email,
					password: hashedPassword
				})

				await newAuthor.save()

				const token = await auth.sign({
					id: newAuthor._id,
					name: newAuthor.name,
					email: newAuthor.email
				})

				return {
					token,
					author: newAuthor
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},

		async refreshToken(_, __, { auth }) {
			const { token } = await auth.refresh()

			return {
				token
			}
		},

		async logout(_, __, { auth }) {
			await auth.logout()
		}
	}
}