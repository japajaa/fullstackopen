import React from 'react'

const Recommendations = (props) => {
  if (!props.show) {
    return null
  }

  let books = []

  if (props.result.loading === false) {
    books = props.result.data.allBooks
  }

  const genres = [...new Set(books.map(book => book.genres).flat())];

  const filteredBooks = props.favorite ? books.filter(book => book.genres.includes(props.favorite)) : books;

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre <b>{props.favorite ? props.favorite : 'all genres'}</b></p>

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
    </div>
  )
}

export default Recommendations