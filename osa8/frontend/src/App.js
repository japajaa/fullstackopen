import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Recommendations from './components/Recommend'
import NewBook from './components/NewBook'
import LoginForm from './components/Login'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'


const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  }
}
`
/*
const ALL_BOOKS = gql`
{
  allBooks  {
    title
    author { id }
    published
  }
}
`
*/
const ALL_BOOKS = gql`
{
  allBooks  {
    title
    author { name }
    published
    genres
    id
  }
}
`
/*
const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author
    published
    id
    genres
  }
}
`
*/

const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author {name}
    published
    id
    genres
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
   name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
    bookCount
  }
}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const ME = gql`
{
  me  {
    favoriteGenre
  }
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author { name }
      published
      genres
      id
    }
  }
`

const App = () => {

  const [token, setToken] = useState(null)
  const [filter, setFilter] = useState(null)

  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const me = useQuery(ME).data.me

  const favorite = me ? me.favoriteGenre : ''

  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.title).includes(object.title)  

      const includedInAuthors = (set, object) => 
      set.map(p => p.name).includes(object.name)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    const authorDataInStore = client.readQuery({ query: ALL_AUTHORS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
      
      if (!includedInAuthors(authorDataInStore.allAuthors, addedBook.author)) {
        const newAddition = {name: addedBook.author.name, born: null, bookCount: 1, __typename: "Author"}
        client.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors : authorDataInStore.allAuthors.concat(newAddition) }
        })
      } else {
        client.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors : authorDataInStore.allAuthors.map(a => a.name === addedBook.author.name ? {...a, bookCount: a.bookCount + 1} : a) }
        })
      }
      
    }   
  }


  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [login] = useMutation(LOGIN)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateCacheWith(subscriptionData.data.bookAdded)
      console.log(subscriptionData)
      window.alert(`A new book was just added: ${subscriptionData.data.bookAdded.title}`)
    }
  })


  const logout = () => {
    setToken(null);
    window.localStorage.clear();
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
  {token && <button onClick={() => setPage('add')}>add book</button> }
  {token && <button onClick={() => logout()}>logout</button> }
  {token && <button onClick={() => setPage('recommendations')}>recommend</button> }
{!token && <button onClick={() => setPage('login')}>login</button> }
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
        editAuthor={editAuthor}
        showEditAuthor={token !== null}
      />

      <Books
        show={page === 'books'}
        result={books}
        filter={filter}
        setFilter={(filter) => setFilter(filter)}
      />

<Recommendations
        show={page === 'recommendations'}
        result={books}
        favorite={favorite}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
      />

    </div>
  )
}

export default App