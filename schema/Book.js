export const types = `
	type Book {
		_id: String
		title: String
		reviews: String
		owner: Author
	}
`

export const queries = `
	books: [Book]
	book(id: String): Book
`

export const mutations = `
  addBook(title: String, owner: String): Book
  deleteBook(id: String): Message
  updateBook(id: String, title: String): Message
  updateBookReview(id: String): Message
`

export const subscriptions = `
	updatedBookReview(id: String): Book
	addedBook: Book
`
