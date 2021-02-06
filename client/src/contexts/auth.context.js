import { useContext, createContext } from 'react'

const asyncNoop = async () => {}
export const AuthContext = createContext({
	user: {},
	autoAuth: false,
	isAuth: false,
	login: asyncNoop,
	logout: asyncNoop,
})

export const useAuthContext = () => {
	return useContext(AuthContext)
}