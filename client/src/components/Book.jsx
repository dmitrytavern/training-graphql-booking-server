import React from 'react'

const Book = (props) => {
	const { title, reviews, owner, onClick } = props

	return (
		<div style={{display: "flex"}}>
			<p>Title: {title}</p>
			<p>Reviews: {reviews}</p>
			<p>Owner: {owner.name}</p>
			<button onClick={onClick}>Delete</button>
		</div>
	)
}

export default Book
