import React from 'react'
import PropTypes from 'prop-types'

const CreateForm = ({
  handleCreate,
  title,
  author,
  url
}) => (
  <div>
    <form onSubmit={handleCreate}>
      <div>title
        <input  {...title} />
      </div>
      <div>
    author
        <input  {...author} />
      </div>
      <div>
    url
        <input  {...url} />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

CreateForm.propTypes = {

  handleCreate: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired

}


export default CreateForm


