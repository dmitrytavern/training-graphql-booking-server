import { useState, useEffect } from 'react'

const useAuth = () => {
	const [autoAuth, setAutoAuth] = useState(false)
	const [isAuth, setIsAuth] = useState(false)
	const [user, setUser] = useState({})

	const login = async ({ token, author }) => {
		setIsAuth(true)
		setUser(author)

		localStorage.setItem('userData', JSON.stringify({
			author,
			token
		}))
	}

	const logout = () => {
		setIsAuth(false)
		setUser({})
		localStorage.removeItem('userData')
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('userData'))

		if (user && user.token) {
			login(user).then(() => setAutoAuth(true))
		} else {
			setAutoAuth(true)
		}
	}, [])

	return {
		autoAuth,
		isAuth,
		user,
		login,
		logout,
	}
}

export default useAuth