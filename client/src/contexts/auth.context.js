import { useContext, createContext } from 'react'

const asyncNoop = async () => {}
export const AuthContext = createContext({
	user: {},
	isAuth: false,
	loading: false,
	register: asyncNoop,
	login: asyncNoop,
	logout: asyncNoop,
	refresh: asyncNoop,
	remove: asyncNoop
})

export const useAuth = () => {
	return useContext(AuthContext)
}