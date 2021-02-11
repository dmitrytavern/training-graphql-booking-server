import { AuthContext } from "../../contexts/auth.context"
import { useState, useEffect, useCallback } from 'react'
import useApolloAuth from "../hooks/provider.auth.hook"

const Auth = (props) => {
	const {
		actions: {
			login: apolloLogin,
			refresh: apolloRefresh,
			logout: apolloLogout,
			autoLogin: apolloAutoLogin,
			register: apolloRegister,
			remove: apolloRemove
		}
	} = useApolloAuth()

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


	const logout = useCallback(async (makeRequest = true) => {
		if (makeRequest) await apolloLogout()

		setLogoutAuthor()
	}, [apolloLogout])


	const refresh = useCallback(async () => {
		await apolloRefresh()
	}, [apolloRefresh])


	const remove = useCallback(async () => {
		await apolloRemove()
		await apolloLogout()
		setLogoutAuthor()
	}, [apolloRemove, apolloLogout])


	/**
	 *  Auto login when page is loading
	 * */
	useEffect(() => {
		authLogin().then()

		const onStorage = () => {
			const logged = localStorage.getItem('logged') || ''
			if (logged === 'false') setLogoutAuthor()
			if (logged === 'true') authLogin().then()
		}

		window.addEventListener('storage', onStorage)
		return () => { window.removeEventListener('storage', onStorage) }
		// eslint-disable-next-line
	}, [])


	return (
		<AuthContext.Provider value={{user, isAuth, loading, register, login, logout, refresh, remove}}>
			{props.children}
		</AuthContext.Provider>
	)
}

export default Auth
