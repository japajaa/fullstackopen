import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification, resetNotification } from '../reducers/notificationReducer.js'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <li>
      <div>
        {anecdote.content} 
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
    )
}


const AnecdoteList = ( props ) => {

const vote = (anecdote) => {
  props.voteAnecdote(anecdote)
  props.setNotification(`you voted '${anecdote.content}'`, 5)
}

console.log(props.anecdotes)
  return (
    <ul>
      {props.anecdotes
      .filter(n => n.content.toLowerCase().includes(props.filter.toLowerCase()))
      .sort((a,b) => b.votes - a.votes)
      .map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification,
  resetNotification
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
export default ConnectedAnecdoteList