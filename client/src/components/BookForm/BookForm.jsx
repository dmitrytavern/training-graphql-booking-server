import './BookForm.sass'
import classes from "./classes"
import { useState } from "react";
import { useMutation } from "@apollo/client"
import { useAuth } from "../../contexts/auth.context"
import * as Request from '../../api/book.api'

const BookForm = () => {
	const { user } = useAuth()
	const [addBook] = useMutation(Request.ADD_BOOK)
	const [form, setForm] = useState({
		title: '',
		status: 'draft'
	})


	const submitHandler = (e) => {
		e.preventDefault()

		if (form.title === '') return

		addBook({
			variables: {
				title: form.title,
				status: form.status
			},
			update: (store, { data }) => {
				const newBook = data.addBook
				const query = Request.GET_PRIVATE_BOOKS
				const variables = { ownerId: user._id }

				const books = store.readQuery({ query, variables })

				if (books) {
					store.writeQuery({
						query,
						variables,
						data: {
							privateBooks: [
								...books.privateBooks,
								newBook
							]
						}
					})
				}

				if (newBook.status === 'published') {
					const query = Request.GET_BOOKS

					const publishedBooks = store.readQuery({ query, variables })

					if (publishedBooks) {
						store.writeQuery({
							query,
							variables,
							data: {
								books: [
									...publishedBooks.books,
									newBook
								]
							}
						})
					}
				}
			}
		})
			.catch((res) => {
				console.log(res)
			})
	}

	const changeHandler = (filed) => {
		return (e) => {
			setForm({...form, [filed]: e.target.value})
		}
	}

	return (
		<form className={classes.root} onSubmit={submitHandler}>
			<div className={classes.wrapper}>
				<input
					type="text"
					placeholder="Name"

					value={form.title}
					onChange={changeHandler('title')}
				/>

				<select
					onChange={changeHandler('status')}
				>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</select>

				<button type="submit">Add book</button>
			</div>
		</form>
	)
}

export default BookForm
