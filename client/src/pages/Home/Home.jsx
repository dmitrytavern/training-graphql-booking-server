import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from "../../contexts/auth.context"

const Home = () => {
	const { logout, isAuth } = useAuth()

	return (
		<div>
			Home page

			{isAuth && <button onClick={logout}>Logout</button>}
			{isAuth && <Link to="/author"><button>Profile</button></Link>}
			{!isAuth && <Link to="/auth"><button>Auth</button></Link>}
		</div>
	)
}

export default Home
