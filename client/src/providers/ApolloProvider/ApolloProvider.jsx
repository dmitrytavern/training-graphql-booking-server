import { ApolloProvider } from "@apollo/client"
import createApolloClient from "./createApolloClient"
import useApolloAuth from '../hooks/provider.auth.hook'

const Apollo = (props) => {
	const { middleware: authMiddleware } = useApolloAuth()

	let client = createApolloClient([
		authMiddleware
	])

	return (
		<ApolloProvider client={client}>
			{props.children}
		</ApolloProvider>
	)
}

export default Apollo
