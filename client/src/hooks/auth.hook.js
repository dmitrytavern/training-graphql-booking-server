import { useState, useEffect } from 'react'

const useAuth = (apolloSetterToken) => {
	const [autoAuth, setAutoAuth] = useState(true)
	const [isAuth, setIsAuth] = useState(false)
	const [user, setUser] = useState({})

	const login = async ({ token, author }) => {
		setIsAuth(true)
		setUser(author)
		apolloSetterToken(token)
	}

	const logout = () => {
		setIsAuth(false)
		setUser({})
	}

	// useEffect(() => {
	// 	if (user && user.token) {
	// 		login(user).then(() => setAutoAuth(true))
	// 	} else {
	// 		setAutoAuth(true)
	// 	}
	// }, [])

	return {
		autoAuth,
		isAuth,
		user,
		login,
		logout,
	}
}

export default useAuth