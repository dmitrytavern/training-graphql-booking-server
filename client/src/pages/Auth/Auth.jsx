import React from 'react'
import {
	Switch,
	Route,
	Link,
	NavLink,
	Redirect,
	useRouteMatch,
} from 'react-router-dom'

import NavBar from "../../components/NavBar"
import NavBarLink from "../../components/NavBarLink"

import AuthLogin from "./components/AuthLogin"
import AuthRegister from "./components/AuthRegister"

const Auth = () => {
	const match = useRouteMatch()

	return (
		<div>
			<h1>Auth component</h1>

			<Link to="/">Back to home</Link>

			<NavBar>
				<NavBarLink to={`${match.path}/login`}>
					Login
				</NavBarLink>
				<NavBarLink to={`${match.path}/register`}>
					Register
				</NavBarLink>
			</NavBar>

			<Switch>
				<Route path={`${match.path}/login`} component={AuthLogin} />
				<Route path={`${match.path}/register`} component={AuthRegister} />
				<Redirect to={`${match.path}/login`}/>
			</Switch>
		</div>
	)
}

export default Auth
