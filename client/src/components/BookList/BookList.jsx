import './BookList.sass'
import classes from "./classes"
import propTypes from 'prop-types'
import Book from "../Book"

const BookList = (props) => {
	const { books, bookType } = props

	return (
		<div className={classes.root}>
			<div className={classes.list}>

				{bookType === 'view' && books && books.map((book, i) => (
					<Book
						key={i}
						className={classes.book}
						type={bookType}
						title={book.title}
						owner={book.owner.name}
						reviews={book.reviews}
					/>
				))}

				{bookType === 'control' && books && books.map((book, i) => (
					<Book
						key={i}
						className={classes.book}
						type={bookType}
						title={book.title}
						reviews={book.reviews}
						status={book.status}
					/>
				))}

			</div>
		</div>
	)
}

BookList.defaultProps = {
	bookType: 'view'
}

BookList.propTypes = {
	books: propTypes.array.isRequired,
	bookType: propTypes.oneOf([
		'view',
		'control'
	])
}

export default BookList
