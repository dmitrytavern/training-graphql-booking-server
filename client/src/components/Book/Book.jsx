import './Book.sass'
import propTypes from 'prop-types'
import clsx from "clsx"
import classes from "./classes"

const Book = (props) => {
	const { type, className, title, reviews, status, owner } = props


	// Class naming

	const rootClassName = clsx({
		[classes.root]: true,
		[classes.rootHover]: false,
		[className]: true
	})

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
					{type === 'control' && ([
						<button key={1} className={clsx([classes.btn, classes.btnEdit])}>Edit</button>,
						<button key={2} className={clsx([classes.btn, classes.btnRemove])}>Remove</button>
					])}
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
