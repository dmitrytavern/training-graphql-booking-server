import { AuthProvider } from "../../contexts/auth.context"
import { useApolloContext } from "../../contexts/apollo.context"
import { useState, useEffect, useCallback } from 'react'

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

	const setLoggedAuthor = (author) => {
		setIsAuth(true)
		setUser(author)
		localStorage.setItem('logged', 'true')
	}

	const setLogoutAuthor = () => {
		setIsAuth(false)
		setUser({})
		localStorage.setItem('logged', 'false')
	}


	const register = useCallback(async (variables) => {
		const { author } = await apolloRegister(variables)

		setLoggedAuthor(author)
	}, [apolloRegister])


	const login = useCallback(async (variables) => {
		const { author } = await apolloLogin(variables)

		setLoggedAuthor(author)
	}, [apolloLogin])


	const authLogin = useCallback(async () => {
		try {
			const { author } = await apolloAutoLogin()

			setLoggedAuthor(author)
			console.log('Auto login: Success')
		} catch (e) {
			console.log('Auto login: Fail')
		}

		setLoading(false)
	}, [apolloAutoLogin])


	const logout = useCallback(async () => {
		await apolloLogout()

		setLogoutAuthor()
	}, [apolloLogout])


	const refresh = useCallback(async () => {
		await apolloRefresh()
	}, [apolloRefresh])


	/**
	 *  Auto login when page is loading
	 * */
	useEffect(() => {
		const onStorage = () => {
			const logged = localStorage.getItem('logged') || ''
			if (logged === 'false') setLogoutAuthor()
			if (logged === 'true') authLogin().then()
		}

		window.addEventListener('storage', onStorage)
		return () => { window.removeEventListener('storage', onStorage) }
	}, [authLogin])

	useEffect(() => {
		authLogin().then()
	}, [authLogin])


	return (
		<AuthProvider value={{user, isAuth, loading, register, login, logout, refresh}}>
			{props.children}
		</AuthProvider>
	)
}

export default Auth
