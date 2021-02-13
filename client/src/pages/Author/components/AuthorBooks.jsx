import React from 'react'
import { useQuery } from "@apollo/client"
import * as Requests from "../../../api/book.api"
import { useAuth } from "../../../contexts/auth.context"

const AuthorBooks = () => {
	const { user } = useAuth()

	const { data, loading } = useQuery(Requests.GET_PRIVATE_BOOKS, {
		variables: { ownerId: user._id },
	})

	if (loading) return <p>Loading...</p>


	return (
		<div>
			Your books:

			{data && data.privateBooks.map((book, i) => (
				<div key={i}>
					<h3>{book.title}</h3>
					<p>Status: {book.status}</p>
				</div>
			))}
		</div>
	)
}

export default AuthorBooks
