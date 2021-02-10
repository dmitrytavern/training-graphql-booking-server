import { useContext, createContext } from 'react'

const noop = async () => {}
export const ApolloContext = createContext({
	register: noop,
	login: noop,
	logout: noop,
	refresh: noop,
	autoLogin: noop
})

export const useApolloContext = () => {
	return useContext(ApolloContext)
}