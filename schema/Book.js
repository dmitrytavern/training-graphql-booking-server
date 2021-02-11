export const types = `
	type Book {
		_id: String
		title: String
		reviews: String
		owner: Author
		status: String
	}
`

export const queries = `
	privateBooks(ownerId: String!): [Book]
	books: [Book]
	book(id: String): Book
`

export const mutations = `
  addBook(title: String, owner: String, status: String): Book
  deleteBook(id: String): Message
  updateBook(id: String, title: String, status: String): Message
  updateBookReview(id: String): Message
`

export const subscriptions = `
	updatedBookReview(id: String): Book
	addedBook: Book
`
