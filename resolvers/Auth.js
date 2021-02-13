import { ApolloError, AuthenticationError } from 'apollo-server'
import bcrypt from 'bcrypt'

export default {
	Mutation: {
		async register(_, { name, email, password }, { db, auth }) {
			try {
				const existsEmail = await db.UserModel.exists({ email })

				if (existsEmail) {
					return new ApolloError("Invalid data", '401', {
						message: 'Author already exists.',
					})
				}


				const hashedPassword = await bcrypt.hash(password, 10)


				const newAuthor = new db.AuthorModel({
					name
				})

				const author = await newAuthor.save()

				const newUser = new db.UserModel({
					email,
					password: hashedPassword,
					authorId: author._id,
				})

				await newUser.save()


				const { token } = await auth.sign({
					id: newAuthor._id,
					userId: newUser._id,
					name: newAuthor.name
				})

				return {
					token,
					author: {
						_id: newAuthor._id,
						name: newAuthor.name,
						email
					}
				}
			} catch (e) {
				throw new ApolloError("Unknown error", "400", {
					message: e
				})
			}
		},


		async login(_, { email, password }, { db, auth }) {
			try {
				const user = await db.UserModel
					.findOne({ email })
					.populate('authorId')

				if (!(user && user.authorId)) {
					return new ApolloError("Invalid field", '401', {
						message: 'Not found author.',
					})
				}

				const {
					password: userPassword,
					authorId: author
				} = user

				const passwordCompare = await bcrypt.compare(password, userPassword)
				if (!passwordCompare) {
					return new ApolloError("Invalid field", '401', {
						message: 'Email or password invalid.',
					})
				}

				const { token } = await auth.sign({
					id: author._id,
					userId: user._id,
					name: author.name,
				})

				return {
					token,
					author: {
						_id: author._id,
						name: author.name,
						email
					}
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

				if (!token) {
					return new ApolloError("Error with token", "401")
				}

				const { email, authorId } = await db.UserModel
					.findById(payload.userId)
					.populate('authorId')

				return {
					token,
					author: {
						_id: authorId._id,
						name: authorId.name,
						email
					}
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
			try {
				await auth.logout()
			} catch (e) {
				throw new AuthenticationError('logout: Unknown fatal error')
			}
		},


		async remove(_, __, { db, auth }) {
			try {
				const { id, userId } = await auth.verify()

				await db.UserModel.findByIdAndRemove(userId)
				await db.AuthorModel.findByIdAndRemove(id)
				await db.BookModel.deleteMany({ owner: id })

				await auth.logoutAll(userId)
			} catch (e) {
				console.error(e)
				throw new AuthenticationError('delete: Unknown error')
			}
		}
	}
}