import { Container } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import './App.css'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import userService from './services/users.js'
import Blog from './components/Blog.js'
import NavBar from './components/NavBar.js'
import CreateForm from './components/CreateForm.js'
import { useField } from './hooks'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog } from './reducers/blogReducer'
import { setUserRedux } from './reducers/userReducer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

function App(props) {

  const store = props.store

  const username = useField('text')
  const password = useField('password')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const comment = useField('text')
  const [newBlogVisible, setNewBlogVisible] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        store.dispatch(initializeBlogs(initialBlogs))
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      store.dispatch(setUserRedux(user))
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    userService
      .getAll().then(users => {
        setUsers(users)
      })
  }, [])


  const Users = () => {

    return (
      <div>
        <h2>Users</h2>
        <table>
          <thead><tr><th></th><th><strong>blogs created</strong></th></tr></thead>
          <tbody>
            {users.map(user => <tr key={user.id} ><td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td></tr>)}
          </tbody>
        </table>
      </div>
    )
  }

  const User = ({ user }) => {

    if ( user === undefined) {
      return null
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
        </ul>
      </div>
    )
  }

  const Notification = (props) => {
    const notification = props.store.getState().notification

    if (notification.text === null || notification.text === '' || notification.text === undefined) {
      return null
    }

    const notificationStyle = {
      color: notification.color
    }

    return (
      <div style={notificationStyle} className="notification">
        {notification.text}
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
      store.dispatch(setUserRedux(user))
    } catch (exception) {
      console.log(exception)
      store.dispatch(setNotification({ text: 'wrong credentials', color:'red' }))
      setTimeout(() => {
        store.dispatch(setNotification({ text: null, color:'pink' }))
      }, 5000)
    }
    username.onSubmit()
    password.onSubmit()
  }

  const handleLogout = (event) => {
    event.preventDefault()
    store.dispatch(setUserRedux(null))
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

      store.dispatch(addBlog(newBlog))
      const singleUser = users.find(n => n.username === store.getState().user.username)
      const changedUser = { ...singleUser, blogs: singleUser.blogs.concat({ author: newBlog.author, id: newBlog.id, title: newBlog.title, url: newBlog.url }) }
      const newUsers = users.map(u => u.username !== store.getState().user.username ? changedUser : changedUser)
      setUsers(newUsers)
      store.dispatch(setNotification({ text: `a new blog ${newBlog.title} by ${newBlog.author} added`, color:'green' }))
      setTimeout(() => {
        store.dispatch(setNotification({ text: null, color:'green' }))
      }, 5000)
    } catch (exception) {
      console.log(exception)
    }

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
          <button onClick={() => setNewBlogVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateForm
            title={title}
            author={author}
            url={url}
            handleCreate={handleCreate}
          />
          <button onClick={() => setNewBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (store.getState().user === null || store.getState().user.username === undefined ) {

    return (
      <div>
        <Notification store={store}/>
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

  const userById = (id, users) => {
    return users.find(user => user.id === id)
  }

  const blogById = (id, blogs) => {
    return blogs.find(blog => blog.id === id)
  }

  return (
    <Container>
      <div>
        <Router>
          <NavBar store={store} handleLogout={handleLogout}/>
          <Notification store={store}/>
          <Route exact path="/" render={() =>
            <div>
              <h2>blogs</h2>
              {createForm()}
              <ul>
                {props.store.getState().blog.sort((a, b) => b.likes - a.likes ).map(blog =>
                  <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
                )}
              </ul>
            </div>
          } />
          <Route exact path="/users" render={() => <Users />} />
          <Route exact path="/users/:id" render={({ match }) => <User user={userById(match.params.id, users)}/>} />
          <Route exact path="/blogs/:id" render={({ match }) => <Blog comment={comment} store={store} user={store.getState().user} blog={blogById(match.params.id, props.store.getState().blog)}/>} />
        </Router>
      </div>
    </Container>
  )
}

export default App