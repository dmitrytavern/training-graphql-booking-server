import './Book.sass'
import propTypes from 'prop-types'
import clsx from "clsx"
import classes from "./classes"

import { Button } from '@material-ui/core'

const Book = (props) => {
	const { type, title, reviews, owner } = props


	// Class naming

	const rootClassName = clsx({
		[classes.root]: true,
		[classes.rootHover]: false
	})

	return (
		<div className={rootClassName}>
			<div className={classes.wrapper}>
				<h2 className={classes.title}>{title}</h2>
				<h3 className={classes.author}>{owner}</h3>

				<div className={classes.btnPanel}>
					<Button className={classes.btnView}>View</Button>
					{type === 'control' && ([
						<Button color="primary" className={classes.btnEdit}>Edit</Button>,
						<Button color="secondary" className={classes.btnRemove}>Remove</Button>
					])}
				</div>
			</div>
		</div>
	)
}

Book.defaultProps = {
	type: 'view'
}

Book.propTypes = {
	type: propTypes.string,
	title: propTypes.string.isRequired,
	reviews: propTypes.string.isRequired,
	owner: propTypes.string.isRequired
}

export default Book
