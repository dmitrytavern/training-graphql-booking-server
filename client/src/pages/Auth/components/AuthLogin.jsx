import { useState } from 'react'
import { useMutation } from "@apollo/client"
import { useAuthContext } from "../../../contexts/auth.context"
import { useHistory } from 'react-router-dom'
import * as Queries from "../../../api/auth.api"

const AuthLogin = () => {
	const { login } = useAuthContext()
	const history = useHistory()
	const [queryLogin, { loading }] = useMutation(Queries.AUTH_LOGIN_MUTATION)

	const [error, setError] = useState(false)
	const [errorMessages, setErrorMessages] = useState('')
	const [formData, setFormData] = useState({
		email: 'v1@gmail.com',
		password: '1234'
	})

	const submitHandler = (e) => {
		e.preventDefault()

		if (!formData.email) {
			setError(true)
			return setErrorMessages('Blank email!')
		}

		if (!formData.password) {
			setError(true)
			return setErrorMessages('Blank password!')
		}


		queryLogin({
			variables: {...formData}
		})
			.then((res) => {
				login(res.data.login)
			})
			.then(() => {
				history.push('/author')
			})
			.catch((res) => {
				console.log(res)
				setError(true)
				setErrorMessages(res.graphQLErrors[0].extensions.message)
			})
	}

	const changeHandler = (field) => {
		return (event) => {
			setError(false)
			setFormData(prev => ({...prev, [field]: event.target.value}))
		}
	}

	return (
		<form onSubmit={submitHandler}>
			<div>
				<input
					type="email"
					placeholder="Email"
					value={formData.email}
					onChange={changeHandler('email')}
				/>
			</div>
			<div>
				<input
					type="password"
					placeholder="Password"
					value={formData.password}
					onChange={changeHandler('password')}
				/>
			</div>

			{error && (<div>{errorMessages}</div>)}

			<button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
		</form>
	)
}

export default AuthLogin
