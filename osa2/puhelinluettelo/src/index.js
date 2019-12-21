import React, { useState, useEffect } from 'react'
import personService from './services/personService'
import ReactDOM from 'react-dom'
import './index.css';

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

const Filter = (props) => {

  return (
    <div>filter shown with<input 
    value={props.value}
    onChange={props.onChange}
      />
    </div>      
  )
}

const Person = (props) => {

  return (
    <div>
      <p>{props.person.name} {props.person.number}<button onClick={props.handleClick}>delete</button></p>
    </div>

  )
}

const Persons = (props) => {

  const filteredList = props.namelist.filter((person) => person.name.toLowerCase().includes(props.filter.toLowerCase()))
  const personsToRender = filteredList.map((person) => <Person key={person.name} person={person} handleClick={() => props.handleClick(person.id, person.name)} />)
 
  return (
    <div>
    {personsToRender}
    </div>
  )
}

const PersonForm = (props) => {

  return (
    <div>
    <form onSubmit={props.addPerson}>
    <div>
      name: <input 
        value={props.newName}
        onChange={props.handleNameChange}
      />
    </div>
    <div>
      number: <input 
      value={props.newNumber}
      onChange={props.handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('') 
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNotificationColor] = useState('orange')


  const handleClick = (id, name) => {
    if (window.confirm('Delete ' + name + '?')) {
      personService
      .deletePerson(id)
        .then(returnedNote => {
          setPersons(persons.filter(n => n.id !== id))
          setNotificationColor('green')
          setNotificationMessage(
            `Deleted ${name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
      })
    }
  }

  useEffect(() => {
    personService
    .getAll()
      .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const isFound = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (!isFound) {
      personService
      .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationColor('green')
        setNotificationMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        })
        .catch(error => {
          setNotificationColor('red')
          setNotificationMessage(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newName} on jo osoitekirjassa, korvataanko vanha numero uudella?`)) {
        personService
        .update(isFound.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== isFound.id ? person : returnedPerson))
          setNotificationColor('green')
          setNotificationMessage(
            `Updated phone number of ${returnedPerson.name} to ${personObject.number}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== isFound.id))
          setNotificationColor('red')
          setNotificationMessage(
            `Information of ${isFound.name} has already been removed from server`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification color={notificationColor} message={notificationMessage}/>
      <Filter value={filter} onChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons namelist={persons} filter={filter} handleClick={handleClick} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App