import { AuthProvider } from "../../contexts/auth.context"
import { useApolloContext } from "../../contexts/apollo.context"
import { useState, useEffect } from 'react'

const Auth = (props) => {
	const {
		login: apolloLogin,
		refresh: apolloRefresh,
		logout: apolloLogout,
		autoLogin: apolloAutoLogin,
		register: apolloRegister
	} = useApolloContext()

	const [isAuth, setIsAuth] = useState(false)
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({})

	const register = async (variables) => {
		const { author } = await apolloRegister(variables)

		setIsAuth(true)
		setUser(author)
	}

	const login = async (variables) => {
		const { author } = await apolloLogin(variables)

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


	/**
	 *  Auto login when page is loading
	 * */
	useEffect(() => {
		apolloAutoLogin()
			.then(({ author }) => {
				setIsAuth(true)
				setUser(author)
				console.log('Auto login: Success')
			})
			.catch(() => {
				console.log('Auto login: Fail')
			})
			.finally(() => {
				setLoading(false)
			})
		// eslint-disable-next-line
	}, [])


	return (
		<AuthProvider value={{user, isAuth, loading, register, login, logout, refresh}}>
			{props.children}
		</AuthProvider>
	)
}

export default Auth
