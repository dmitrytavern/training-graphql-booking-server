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