export const types = `
	type Author {
		_id: String
		name: String
		email: String
		books: [Book]
	}
`

export const queries = `
	author(id: String): Author
	authors: [Author]
`

export const mutations = `
	addAuthor(name: String, email: String): Author
  deleteAuthor(id: String): Message
  updateAuthor(id: String, name: String): Message
`