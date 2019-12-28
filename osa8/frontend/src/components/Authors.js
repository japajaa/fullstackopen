import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    console.log('set birthyear...')
    const born = parseInt(birthyear)
console.log(born)
    await props.editAuthor({
      variables: { name, setBornTo: born }
    })

    setName('')
    setBirthyear('')
  }

  if (!props.show) {
    return null
  }

  let authors = []

  if (props.result.loading === false) {
    authors = props.result.data.allAuthors
  }

  console.log(authors)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {props.showEditAuthor ?
<>
<h3>Set birthyear</h3>
<form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
        </form></> : null
}
    </div>
  )
}

export default Authors