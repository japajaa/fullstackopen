import React, {useState} from 'react'
import blogService from '../services/blogs'

const Blog = ({ user, blog, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showIfUser = {display: user.username  === blog.user.username ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
    console.log(showIfUser)
    console.log(user.username)
  console.log(blog.user.username)
  console.log(blog)
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
      blog.likes = blog.likes + 1
      const theOne = blogs.find(n => n.id === blog.id)
      setBlogs(blogs.filter(n => n.id !== blog.id).concat(result))
    } catch (exception) {
     
    }  
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    const result = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    
    if (result) {
      try {
        const result = await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(n => n.id !== blog.id))
      } catch (exception) {
     
      } 
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
      <button style={showIfUser} onClick={handleDelete}>delete</button>
      </div>
    </div>
  </div>
  )
}

export default Blog
