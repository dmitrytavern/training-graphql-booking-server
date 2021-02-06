import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
	query GetBooks($owner_id: String) {
		books(ownerId: $owner_id) {
			title,
			status
		}
	}
`