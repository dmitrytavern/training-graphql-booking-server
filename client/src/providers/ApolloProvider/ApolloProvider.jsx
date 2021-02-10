import { ApolloContext } from "../../contexts/apollo.context"
import { ApolloClient, HttpLink, ApolloProvider, InMemoryCache, concat } from "@apollo/client"
import useApolloAuth from './authMiddleware'

let client
const Apollo = (props) => {
	const { middleware: authMiddleware, register, login, autoLogin, refresh, logout } = useApolloAuth(client)

	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
		credentials: 'include',
	})

	client = new ApolloClient({
		link: concat(
			authMiddleware,
			httpLink
		),
		cache: new InMemoryCache(),
	})

	return (
		<ApolloProvider client={client}>
			<ApolloContext.Provider value={{register, login, autoLogin, logout, refresh}}>
				{props.children}
			</ApolloContext.Provider>
		</ApolloProvider>
	)
}

export default Apollo
