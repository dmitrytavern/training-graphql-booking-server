import { AuthProvider } from "../../contexts/auth.context"
import { useApolloContext } from "../../contexts/apollo.context"
import { useState, useEffect } from 'react'

const Auth = (props) => {
	const {
		login: apolloLogin,
		refresh: apolloRefresh,
		logout: apolloLogout,
		autoLogin: apolloAutoLogin
	} = useApolloContext()

	const [isAuth, setIsAuth] = useState(false)
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({})

	const login = async (variables) => {
		const author = await apolloLogin(variables)

		setIsAuth(true)
		setUser(author)
	}

	const logout = async () => {
		await apolloLogout()

		setIsAuth(false)
		setUser({})
	}

	const refresh = async () => {
		await apolloRefresh()
	}

	useEffect(() => {
		apolloAutoLogin()
			.then((author) => {
				setIsAuth(true)
				setUser(author)
			})
			.catch((res) => {
				console.log(res)
				console.log('Auto login is fail!')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])


	return (
		<AuthProvider value={{user, isAuth, loading, login, logout, refresh}}>
			{props.children}
		</AuthProvider>
	)
}

export default Auth
