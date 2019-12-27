import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification, resetNotification } from '../reducers/notificationReducer.js'

const AnecdoteForm = (props) => {

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.setNotification(`you created '${content}'`, 5)
  }

  return (
    <div>
    <h2>create new</h2>
    <form onSubmit={create}>
      <div><input name='anecdote'/></div>
      <button type='submit'>create</button>
    </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  // joskus on hyödyllistä tulostaa mapStateToProps:ista...
  console.log(state)
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  createAnecdote,
  setNotification,
  resetNotification
}

const ConnectedAnecdoteForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteForm)
export default ConnectedAnecdoteForm