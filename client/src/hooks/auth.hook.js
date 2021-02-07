import { useState } from 'react'

const useAuth = (apolloSetterToken) => {
	const [autoAuth, setAutoAuth] = useState(true)
	const [isAuth, setIsAuth] = useState(false)
	const [user, setUser] = useState({})

	const refresh = async () => {

	}

	const login = async ({ token, author }) => {
		setIsAuth(true)
		setUser(author)
		apolloSetterToken(token)
	}

	const logout = () => {
		setIsAuth(false)
		setUser({})
	}

	return {
		autoAuth,
		isAuth,
		user,
		login,
		logout,
	}
}

export default useAuth