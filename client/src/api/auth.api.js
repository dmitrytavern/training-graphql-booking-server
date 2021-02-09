import { gql } from '@apollo/client'

export const AUTH_LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			author {
				_id,
				name,
				email
			}
		}
	}
`

export const AUTH_AUTO_LOGIN_MUTATION = gql`
	mutation AutoLogin{
		autoLogin {
			token
			author {
				_id,
				name,
				email
			}
		}
	}
`

export const AUTH_REGISTRATION_MUTATION = gql`
	mutation Register($name: String!, $email: String!, $password: String!) {
		register(name: $name, email: $email, password: $password) {
			token
			author {
				_id,
				name,
				email
			}
		}
	}
`

export const AUTH_REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`

export const AUTH_LOGOUT_MUTATION = gql`
	mutation Logout {
		logout
	}
`