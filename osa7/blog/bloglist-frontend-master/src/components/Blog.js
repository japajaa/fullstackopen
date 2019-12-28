import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'
import { voteBlog, deleteBlog, addComment } from '.././reducers/blogReducer'

const Blog = ({ blog, store, comment }) => {
  const [visible, setVisible] = useState(true)

  if ( blog === undefined) {
    return null
  }

  if ( store.getState().user.username === undefined) {
    return null
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showIfUser = { display: store.getState().user.username  === blog.user.username ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const updatedBlog = {
      user: blog.user ? blog.user.id : false,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const result = await blogService.update(blog.id, updatedBlog)
      store.dispatch(voteBlog(result))
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    const result = window.confirm(`remove blog ${blog.title} by ${blog.author}`)

    if (result) {
      try {
        await blogService.deleteBlog(blog.id)
        store.dispatch(deleteBlog(blog.id))
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()

    try {
      const updated = await blogService.comment(blog.id, comment.value)
      store.dispatch(addComment(updated))
    } catch (exception) {
      console.log(exception)
    }
    comment.onSubmit()
  }

  return (
    <div style={blogStyle}>
      <div className='blogHeader' onClick={toggleVisibility}>
        {blog.title} {blog.author}
        <div className='togglableContent' style={showWhenVisible}>
          <span><a href={blog.url}>{blog.url}</a></span>
          <br></br>
          <span>{blog.likes} likes<button onClick={handleLike}>like</button></span>
          <br></br>
          <span>added by { blog.user ? blog.user.name : 'unknown user' }</span>
          <button style={showIfUser} onClick={handleDelete}>delete</button>
        </div>
      </div>
      <h3>Comments</h3>
      <input  {...comment} />
      <button onClick={handleComment}>add comment</button>
      <ul>
        {blog.comments.length > 0 ? blog.comments.map((comment, index) => <li key={index}>{comment}</li>) : 'no comments yet'}
      </ul>
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,

}

export default Blog
