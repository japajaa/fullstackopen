import React, { useState, useEffect } from 'react';
import './App.css';
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import Blog from './components/Blog.js'
import CreateForm from './components/CreateForm.js'

function App() {

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')  
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
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationColor('red')
      setNotificationMessage('wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('logging out')
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    console.log('Going to create: ', title, author, url)

    try {
      const newBlog = await blogService.create({
        title: title,
        author: author,
        url: url
      })
      setBlogs(blogs.concat(newBlog))
      setNotificationColor('green')
      setNotificationMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
     
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

const createForm = () => {
  const hideWhenVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: newBlogVisible ? '' : 'none' }

  return (
    <div>
    <div style={hideWhenVisible}>
      <button onClick={() => setNewBlogVisible(true)}>new blog</button>
    </div>
    <div style={showWhenVisible}>
<CreateForm
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleCreate={handleCreate}
      />
      <button onClick={() => setNewBlogVisible(false)}>cancel</button>
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
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input 
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App;