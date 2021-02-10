import { useState } from 'react'
import { useAuth } from "../../../contexts/auth.context"
import { useHistory } from "react-router-dom"

const AuthRegister = () => {
	const { register } = useAuth()
	const history = useHistory()

	const [loading, setLoading] = useState(false)
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


		setLoading(true)
		register({...formData})
			.then(() => {
				history.push('/author')
			})
			.catch((res) => {
				setLoading(false)
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
