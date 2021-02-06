import { useContext, createContext } from 'react'

const asyncNoop = async () => {}
export const AuthContext = createContext({
	autoAuth: false,
	isAuth: false,
	login: asyncNoop,
	logout: asyncNoop,
	register: asyncNoop,
})

export const useAuthContext = () => {
	return useContext(AuthContext)
}