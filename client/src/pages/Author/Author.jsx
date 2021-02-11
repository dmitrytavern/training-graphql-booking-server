import { Link } from 'react-router-dom'
import { useQuery } from "@apollo/client"
import { useAuth } from "../../contexts/auth.context"
import * as Requests from '../../api/book.api'

const Author = () => {
	const { user } = useAuth()
	const { data, refetch, loading } = useQuery(Requests.GET_PRIVATE_BOOKS, {
		variables: { ownerId: user._id },
	})

	if (loading) return <p>Loading...</p>

	return (
		<div>
			<h1>Author</h1>

			<button><Link to="/home">Back to home</Link></button>
			<button onClick={() => refetch({ ownerId: user._id })}>Reload</button>

			{data && data.privateBooks.map((book, i) => (
				<div key={i}>
					<h3>{book.title}</h3>
					<p>Status: {book.status}</p>
				</div>
			))}
		</div>
	)
}

export default Author
