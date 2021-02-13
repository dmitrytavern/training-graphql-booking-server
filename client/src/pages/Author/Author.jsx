import { Switch, Route, Redirect, Link, NavLink, useRouteMatch } from 'react-router-dom'

import AuthorHome from './components/AuthorHome'
import AuthorBooks from "./components/AuthorBooks"
import AuthorSettings from "./components/AuthorSettings"

const Author = () => {
	const match = useRouteMatch()

	return (
		<div>
			<h1>Author</h1>

			<button><Link to="/home">Back to home</Link></button>

			<div className="nav-bar">
				<NavLink to={`${match.path}/home`} className="nav-bar-link" activeClassName={'is-active'}>
					Home
				</NavLink>
				<NavLink to={`${match.path}/books`} className="nav-bar-link" activeClassName={'is-active'}>
					Books
				</NavLink>
				<NavLink to={`${match.path}/settings`} className="nav-bar-link" activeClassName={'is-active'}>
					Settings
				</NavLink>
			</div>

			<Switch>
				<Route path={`${match.path}/home`}>
					<AuthorHome/>
				</Route>

				<Route path={`${match.path}/books`}>
					<AuthorBooks/>
				</Route>

				<Route path={`${match.path}/settings`}>
					<AuthorSettings/>
				</Route>

				<Redirect to={`${match.path}/home`}/>
			</Switch>
		</div>
	)
}

export default Author
