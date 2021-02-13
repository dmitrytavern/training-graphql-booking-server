import React from 'react'
import {
	Switch,
	Route,
	Link,
	NavLink,
	Redirect,
	useRouteMatch,
} from 'react-router-dom'

import AuthLogin from "./components/AuthLogin"
import AuthRegister from "./components/AuthRegister"

const Auth = () => {
	const match = useRouteMatch()

	return (
		<div>
			<h1>Auth component</h1>

			<Link to="/">Back to home</Link>

			<div className="nav-bar">
				<NavLink to={`${match.path}/login`} className="nav-bar-link" activeClassName={'is-active'}>
					Login
				</NavLink>
				<NavLink to={`${match.path}/register`} className="nav-bar-link" activeClassName={'is-active'}>
					Register
				</NavLink>
			</div>

			<Switch>
				<Route path={`${match.path}/login`} component={AuthLogin} />
				<Route path={`${match.path}/register`} component={AuthRegister} />
				<Redirect to={`${match.path}/login`}/>
			</Switch>
		</div>
	)
}

export default Auth
