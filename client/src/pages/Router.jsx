import { Route, Switch, Redirect } from "react-router-dom"

import { useAuth } from "../contexts/auth.context"

import Home from './Home'
import Auth from "./Auth"
import Author from "./Author"
import AuthorBooks from "./AuthorBooks"

const Router = () => {
	const { isAuth, loading } = useAuth()

	return (
		<Switch>
			<Route path="/home" component={Home} />

			{!isAuth && (
				<Route path="/auth">
					<Auth/>
				</Route>
			)}

			{isAuth && (
				<Route path="/author" exact >
					<Author/>
				</Route>
			)}

			{isAuth && (
				<Route path="/author/books">
					<AuthorBooks/>
				</Route>
				)}

			{!loading && <Redirect to="/home"/>}
		</Switch>
	)
}

export default Router
