import './Author.sass'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'

import Container from "../../components/Container"
import NavBar from "../../components/NavBar"
import NavBarLink from "../../components/NavBarLink"
import AuthorHeader from "./components/Header"

import AuthorHome from './components/AuthorHome'
import AuthorBooks from "./components/AuthorBooks"
import AuthorSettings from "./components/AuthorSettings"

const Author = () => {
	const match = useRouteMatch()

	return (
		<Container>
			<AuthorHeader />

			<NavBar>
				<NavBarLink to={`${match.path}/home`}>Home</NavBarLink>
				<NavBarLink to={`${match.path}/books`}>Books</NavBarLink>
				<NavBarLink to={`${match.path}/settings`}>Settings</NavBarLink>
			</NavBar>

			<Switch>
				<Route path={`${match.path}/home`}><AuthorHome/></Route>
				<Route path={`${match.path}/books`}><AuthorBooks/></Route>
				<Route path={`${match.path}/settings`}><AuthorSettings/></Route>
				<Redirect to={`${match.path}/home`}/>
			</Switch>
		</Container>
	)
}

export default Author
