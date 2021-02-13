import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
	query GetBooks($ownerId: String) {
		books(ownerId: $ownerId) {
			title
			reviews
			owner {
				name
			}
		}
	}
`

export const GET_PRIVATE_BOOKS = gql`
	query GetPrivateBooks($ownerId: String!) {
		privateBooks(ownerId: $ownerId) {
			title
			reviews
			status
		}
	}
`