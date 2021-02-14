import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
	query GetBooks($ownerId: String) {
		books(ownerId: $ownerId) {
			_id
			title
			status
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
			_id
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

export const UPDATE_BOOK = gql`
	mutation UpdateBook($id: String, $title: String, $status: String) {
		updateBook(id: $id, title: $title, status: $status) {
			_id
			title
			reviews
			status
			owner {
				name
			}
		}
	}
`

export const DELETE_BOOK = gql`
	mutation RemoveBook($id: String!) {
		deleteBook(id: $id) {
			success
		}
	}
`