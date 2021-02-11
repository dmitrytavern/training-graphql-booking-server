import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache()

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
	credentials: 'include',
})

const createApolloClient = (middlewares = []) => {
	return new ApolloClient({
		cache,
		link: from([
			...middlewares,
			httpLink
		])
	})
}

export default createApolloClient
