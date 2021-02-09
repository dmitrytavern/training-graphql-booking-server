import React, {useEffect} from 'react'
import { useQuery } from "@apollo/client"
import * as Query from '../../api/book.api'
import { useAuthContext } from "../../contexts/auth.context";

const Author = () => {
	const { user } = useAuthContext()
	const {data, refetch, loading} = useQuery(Query.GET_BOOKS, {
		variables: { owner_id: user._id }
	})

	useEffect(() => {
		console.log(data)
	}, [data])

	if (loading) return <p>Loading...</p>

	return (
		<div>
			<h1>Author</h1>

			<button onClick={() => refetch({ owner_id: user._id })}>Reload</button>

			{data.books.map((book, i) => (
				<div key={i}>
					<h3>{book.title}</h3>
					<p>Status: {book.status}</p>
				</div>
			))}
		</div>
	)
}

export default Author
