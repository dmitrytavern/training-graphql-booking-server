import './NavBar.sass'
import classes from './classes'
import clsx from "clsx"
import propTypes from 'prop-types'

const NavBar = (props) => {
	const { className, children } = props

	return (
		<div className={clsx([classes.root, className])}>
			<div className={classes.wrapper}>
				{children}
			</div>
		</div>
	)
}

NavBar.defaultProps = {
	className: ''
}

NavBar.propTypes = {
	className: propTypes.string
}

export default NavBar
