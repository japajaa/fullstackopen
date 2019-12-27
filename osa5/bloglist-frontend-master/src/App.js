import React, { useState, useEffect } from 'react'
import './App.css'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import Blog from './components/Blog.js'
import CreateForm from './components/CreateForm.js'
import { useField } from './hooks'

function App() {

  const username = useField('text')
  const password = useField('password')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNotificationColor] = useState('orange')
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message, color }) => {
    if (message === null) {
      return null
    }

    const notificationStyle = {
      color: color
    }

    return (
      <div style={notificationStyle} className="notification">
        {message}
      </div>
    )
  }



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log(exception)
      setNotificationColor('red')
      setNotificationMessage('wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create({
        title: title.value,
        author: author.value,
        url: url.value
      })
      setBlogs(blogs.concat(newBlog))
      setNotificationColor('green')
      setNotificationMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
    }

    title.onSubmit()
    author.onSubmit()
    url.onSubmit()
  }

  const cancelCreate = () => {
    setNewBlogVisible(false)
    title.onSubmit()
    author.onSubmit()
    url.onSubmit()

  }

  const createForm = () => {
    const hideWhenVisible = { display: newBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: newBlogVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogVisible(true)}>new note</button>
        </div>
        <div style={showWhenVisible}>
          <CreateForm
            title={title}
            author={author}
            url={url}
            handleCreate={handleCreate}
          />
          <button onClick={() => cancelCreate()}>cancel</button>
        </div>
      </div>

    )
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage} color={notificationColor}/>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
        username
            <input  {...username} />
          </div>
          <div>
        password
            <input  {...password} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} color={notificationColor}/>
      <h2>blogs</h2>
      <div>
        <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
      </div>
      {createForm()}
      {blogs.sort((a, b) => b.likes - a.likes ).map(blog =>
        <Blog user={user} blogs={blogs} setBlogs={setBlogs} key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App