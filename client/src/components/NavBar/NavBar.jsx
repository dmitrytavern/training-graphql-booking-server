import './NavBar.sass'
import classes from './classes'

const NavBar = (props) => {
	const { children } = props

	return (
		<div className={classes.root}>
			<div className={classes.wrapper}>
				{children}
			</div>
		</div>
	)
}

export default NavBar
