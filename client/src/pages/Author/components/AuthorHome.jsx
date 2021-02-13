import React from 'react'
import { useQuery } from "@apollo/client"
import * as Requests from "../../../api/book.api"

import Book from "../../../components/Book"
import { useAuth } from "../../../contexts/auth.context";

const AuthorHome = () => {
	const { user } = useAuth()
	const { data, refetch, loading } = useQuery(Requests.GET_BOOKS, {
		variables: { ownerId: user._id },
	})

	if (loading) return <p>Loading...</p>

	return (
		<div>
			Recent books:

			<button onClick={() => refetch()}>Reload</button>

			{data && data.books.map((value, i) => (
				<Book
					key={i}
					title={value.title}
					owner={value.owner.name}
					reviews={value.reviews}
				/>
			))}
		</div>
	)
}

export default AuthorHome
