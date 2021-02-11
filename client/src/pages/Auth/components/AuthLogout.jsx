import { useEffect } from 'react'
import { useAuth } from "../../../contexts/auth.context"
import { useHistory } from "react-router-dom"

const AuthLogout = () => {
	const { logout } = useAuth()
	const history = useHistory()

	useEffect(() => {
		logout(history.location.state.makeRequest)
		history.push('/auth')
	}, [logout, history])

	return null
}

export default AuthLogout
