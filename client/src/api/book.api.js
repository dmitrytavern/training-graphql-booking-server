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

export const ADD_BOOK = gql`
	mutation AddBook($title: String, $status: String) {
		addBook(title: $title, status: $status) {
			title
			reviews
			status
		}
	}
`