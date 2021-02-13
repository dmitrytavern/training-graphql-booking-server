import React from 'react'
import { useAuth } from "../../../contexts/auth.context"

const AuthorSettings = () => {
	const { remove } = useAuth()


	return (
		<div>
			<button onClick={() => remove()}>Remove Account</button>
		</div>
	)
}

export default AuthorSettings
