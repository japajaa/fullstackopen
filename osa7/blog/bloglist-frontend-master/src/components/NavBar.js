import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = ({ store, handleLogout }) => (

  <div>
    <Link to="/users">users</Link>
    <Link to="/">blogs</Link>
    <span>{store.getState().user.name} logged in<button onClick={handleLogout}>Logout</button></span>
  </div>

)

export default NavBar