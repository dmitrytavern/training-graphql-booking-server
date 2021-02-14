import React from 'react'
import { useAuth } from "../../../contexts/auth.context"
import { useQuery } from "@apollo/client"
import * as Requests from "../../../api/book.api"

import BookList from "../../../components/BookList"

const AuthorHome = () => {
	const { user } = useAuth()
	const { data, loading } = useQuery(Requests.GET_BOOKS, {
		variables: { ownerId: user._id },
	})

	if (loading) return <p>Loading...</p>

	return (
		<div>
			{data && <BookList books={data.books}/>}
		</div>
	)
}

export default AuthorHome
