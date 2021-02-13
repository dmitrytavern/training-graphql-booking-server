import './NavBarLink.sass'

import { NavLink } from 'react-router-dom'

const NavBarLink = (props) => {
	const { to, children, ...other } = props

	return (
		<NavLink to={to} {...other} className="nav-bar-link" activeClassName={'is-active'}>
			{children}
		</NavLink>
	)
}

export default NavBarLink
