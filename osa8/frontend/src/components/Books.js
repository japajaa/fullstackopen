import React from 'react'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  let books = []

  if (props.result.loading === false) {
    books = props.result.data.allBooks
  }

  const genres = [...new Set(books.map(book => book.genres).flat())];

  const filteredBooks = props.filter ? books.filter(book => book.genres.includes(props.filter)) : books;

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{props.filter ? props.filter : 'all genres'}</b></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
      {genres.map(a =>
            <button key={a} onClick={() => props.setFilter(a)}>
              {a}
            </button>
          )}
      <button key='allgenres' onClick={() => props.setFilter(null)}>
        all genres
      </button>
      </div>
    </div>
  )
}

export default Books