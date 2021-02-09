import { useContext, createContext } from 'react'

const asyncNoop = async () => {}
export const AuthContext = createContext({
	user: {},
	isAuth: false,
	loading: false,
	login: asyncNoop,
	logout: asyncNoop,
	refresh: asyncNoop,
})

export const AuthProvider = AuthContext.Provider

export const useAuthContext = () => {
	return useContext(AuthContext)
}