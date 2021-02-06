import React from 'react'
import { useAuthContext } from "../../contexts/auth.context"

const Home = () => {
	const { logout, isAuth } = useAuthContext()

	return (
		<div>
			Home page

			{isAuth && <button onClick={logout}>Logout</button>}
		</div>
	)
}

export default Home
