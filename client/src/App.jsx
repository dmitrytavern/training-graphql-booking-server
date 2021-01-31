import { useEffect, useState } from 'react'
import { useQuery, useMutation, gql } from "@apollo/client";
import Book from "./components/Book"

const GET_BOOKS = gql`
  query {
    books {
      _id
      title
      reviews
      owner {
        name
      }
    }
  }
`

const DELETE_BOOK = gql`
  mutation($id: String) {
    deleteBook(id: $id) {
      success
    }
  }
`

const GET_NEW_BOOK_SUBSCRIPTION = gql`
  subscription {
    addedBook {
      _id
      title
      reviews
      owner {
        name
      }
    }
  }
`

function App() {
  const { loading, error, data, subscribeToMore } = useQuery(GET_BOOKS)
  const [removeBook] = useMutation(DELETE_BOOK)
  const [books, setBooks] = useState([])

  useEffect(() => {
    subscribeToMore({
      document: GET_NEW_BOOK_SUBSCRIPTION,
      updateQuery (prev, { subscriptionData }) {
        setBooks([...prev.books, subscriptionData.data.addedBook])
      }
    })
  }, [])

  useEffect(() => {
    if (!loading && !error) {
      setBooks(data.books)
    }
  }, [loading, error])

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error</h1>

  const handlerClick = (id, index) => {
    removeBook({
      variables: {
        id
      }
    }).then(() => {
      const array = [...books]
      array.splice(index, 1)
      setBooks(array)
    })
  }

  return (
    <div>
      {books.map((value, index) => (
        <Book
          key={index}
          title={value.title}
          reviews={value.reviews}
          owner={value.owner}
          onClick={() => handlerClick(value._id, index)}
        />
        ))}
    </div>
  );
}

export default App;
