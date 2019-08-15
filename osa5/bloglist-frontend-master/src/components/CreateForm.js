import React from 'react'

const CreateForm = ({
  handleCreate,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
 }) => (
  <div>
    <form onSubmit={handleCreate}>
    <div>title
    <input
    key="titlekey"
        type="text"
        value={title}
        name="title"
        onChange={handleTitleChange}
    />
    </div>
    <div>
    author
    <input
        type="text"
        value={author}
        name="author"
        onChange={handleAuthorChange}
    />
    </div>
    <div>
    url
    <input
        type="text"
        value={url}
        name="url"
        onChange={handleUrlChange}
    />
    </div>
    <button type="submit">create</button>
  </form>
  </div>
)

export default CreateForm


