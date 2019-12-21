require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
/*
let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2

    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]
*/


app.get('/info', (req, res, next) => {
  Person.countDocuments().then(count => {
    res.send('<p>Phonebook has ' + count + ' names</p><p>' + new Date() + '</p>')
  })
    .catch(error => next(error))
})


app.get('/api/persons', (req, res, next) => {
  Person.find().then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})



app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {

  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {


  const body = req.body

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  else {
    return response.status(400).send({ error: 'some unclassified error :(' })
  }

}

app.use(errorHandler)


/*
    if (!body.name) {
        return res.status(400).json({
          error: 'name missing'
        })
      }

    if (!body.number) {
        return res.status(400).json({
          error: 'number missing'
        })
      }

 */


//old search for duplicate names
/*
const isFound = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

    if (isFound) {
        return res.status(400).json({
          error: `name must be unique`
        })
      }
      const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)
      }

    persons = persons.concat(person)
    res.json(person)
  })
*/


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})