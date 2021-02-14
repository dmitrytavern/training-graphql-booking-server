import './AuthorBooks.sass'
import { useAuth } from "../../../contexts/auth.context"
import { useQuery } from "@apollo/client"
import * as Requests from "../../../api/book.api"

import BookForm from "../../../components/BookForm"
import BookList from "../../../components/BookList"

const AuthorBooks = () => {
	const { user } = useAuth()

	const { data, loading } = useQuery(Requests.GET_PRIVATE_BOOKS, {
		variables: { ownerId: user._id },
	})

	if (loading) return <p>Loading...</p>


	return (
		<div className="author-book">
			<div className="author-book__form">
				<BookForm />
			</div>

			<div className="author-book__list">
				{data && <BookList books={data.privateBooks} bookType="control"/>}
			</div>
		</div>
	)
}

export default AuthorBooks
