import './Book.sass'
import propTypes from 'prop-types'
import clsx from "clsx"
import classes from "./classes"
import { useState } from 'react'
import { useMutation } from "@apollo/client";
import * as Requests from '../../api/book.api'
import { useAuth } from "../../contexts/auth.context";
import * as Request from "../../api/book.api";

const Book = (props) => {
	const { type, className, id, title, reviews, status, owner } = props
	const { user } = useAuth()
	const [updateBook] = useMutation(Requests.UPDATE_BOOK)
	const [editing, setEditing] = useState(false)
	const [form, setForm] = useState({
		title,
		status
	})

	const submitHandler = (e) => {
		e.preventDefault()

		if (form.title === '') return

		updateBook({
			variables: {...form, id},
			update: (store, { data }) => {
				const query = Requests.GET_PRIVATE_BOOKS
				const variables = { ownerId: user._id }

				const books = store.readQuery({ query, variables })

				const updateBook = (book) => {
					let newBook = null
					if (book._id === id) {
						newBook = Object.assign({}, book, {
							title: data.updateBook.title,
							status: data.updateBook.status
						})
					}

					return newBook || book
				}

				const arrayBook = books.privateBooks.map(updateBook)

				if (books) {
					store.writeQuery({
						query,
						variables,
						data: {
							privateBooks: [ ...arrayBook ]
						}
					})
				}


				const queryPub = Request.GET_BOOKS
				const publishedBooks = store.readQuery({ query: queryPub, variables })

				if (publishedBooks) {
					let existsBook = false
					const arrayBook = publishedBooks.books
						.map((book) => {
							if (book._id === id) existsBook = true
							return updateBook(book)
						})
						.filter((b) => b.status === 'published')

					if (!existsBook && data.updateBook.status === 'published') {
						arrayBook.push(data.updateBook)
					}

					store.writeQuery({
						query: queryPub,
						variables,
						data: {
							books: [ ...arrayBook ]
						}
					})
				}

			}
		})
			.then(() => {
				setEditing(false)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const changeHandler = (field) => {
		return ({ target }) => {
			setForm({...form, [field]: target.value})
		}
	}

	// Class naming

	const rootClassName = clsx({
		[classes.root]: true,
		[classes.rootHover]: false,
		[className]: true
	})

	if (editing) {
		return (
			<div className={rootClassName}>
				<div className={classes.wrapper}>
					<form onSubmit={submitHandler}>
						<div className={classes.form}>
							<input
								type="text"
								placeholder="Title"
								value={form.title}
								onChange={changeHandler('title')}
							/>
							<select
								value={form.status}
								onChange={changeHandler('status')}
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
						</div>

						<div className={classes.btnPanel}>
							<button className={clsx([classes.btn, classes.btnEdit])}>Save</button>
						</div>
					</form>
				</div>
			</div>
		)
	}

	return (
		<div className={rootClassName}>
			<div className={classes.wrapper}>
				<h2 className={classes.title}>{title}</h2>
				{type === 'view' && <h3 className={classes.author}>{owner}</h3>}

				<ul className={classes.params}>
					{type === 'control' && <li className={classes.status}>Status: {status}</li>}
					<li>Reviews: {reviews}</li>
				</ul>

				<div className={classes.btnPanel}>
					<button className={clsx([classes.btn, classes.btnView])}>View</button>

					{type === 'control' && (
						<button
							className={clsx([classes.btn, classes.btnEdit])}
							onClick={() => setEditing(true)}
						>Edit</button>
					)}

					{type === 'control' && <button className={clsx([classes.btn, classes.btnRemove])}>Remove</button>}
				</div>
			</div>
		</div>
	)
}

Book.defaultProps = {
	type: 'view',
	className: ''
}

Book.propTypes = {
	className: propTypes.string,
	type: propTypes.oneOf([
		'view',
		'control'
	]),
	title: propTypes.string.isRequired,
	reviews: propTypes.string,
	owner: propTypes.string,
	status: propTypes.string
}

export default Book
