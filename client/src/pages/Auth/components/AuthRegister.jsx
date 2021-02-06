import { useState } from 'react'
import { useMutation } from "@apollo/client"
import { useAuthContext } from "../../../contexts/auth.context"
import { useHistory } from "react-router-dom"
import * as Queries from "../../../api/auth.api"

const AuthRegister = () => {
	const { login } = useAuthContext()
	const history = useHistory()
	const [queryRegister, { loading }] = useMutation(Queries.AUTH_REGISTRATION_MUTATION)

	const [error, setError] = useState('')
	const [errorMessages, setErrorMessages] = useState('')
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: ''
	})

	const submitHandler = (e) => {
		e.preventDefault()

		if (!formData.email) {
			setError(true)
			setErrorMessages('Blank name!')
			return
		}
		if (!formData.email) {
			setError(true)
			setErrorMessages('Blank email!')
			return
		}
		if (!formData.password) {
			setError(true)
			setErrorMessages('Blank password!')
			return
		}


		queryRegister({
			variables: {...formData}
		})
			.then((res) => {
				login(res.data.register)
			})
			.then(() => {
				history.push('/author')
			})
			.catch((res) => {
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
					type="text"
					placeholder="Name"
					value={formData.name}
					onChange={changeHandler('name')}
				/>
			</div>
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

export default AuthRegister
