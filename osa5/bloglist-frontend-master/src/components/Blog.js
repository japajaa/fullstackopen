import React, {useState} from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async (event) => {
    event.preventDefault()
    console.log(`Going to add like to ${blog.title}`)

    const updatedBlog = {
      user: blog.user ? blog.user.id : false,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    console.log(updatedBlog, blog.id)

    try {
      const result = await blogService.update(blog.id, updatedBlog)
      blog.likes = blog.likes + 1
      console.log(result)
    } catch (exception) {
     
    }  
  }

  return (
  <div style={blogStyle}>
    <div onClick={toggleVisibility}>
      {blog.title} {blog.author}
      <div style={showWhenVisible}>
      <span><a href={blog.url}>{blog.url}</a></span>
      <br></br>
      <span>{blog.likes} likes<button onClick={handleLike}>like</button></span>
      <br></br>
      <span>added by { blog.user ? blog.user.name : 'unknown user' }</span>
      </div>
    </div>
  </div>
  )
}

export default Blog
