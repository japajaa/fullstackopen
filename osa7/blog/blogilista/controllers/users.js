const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 } )
  response.json(users.map(user => user.toJSON()))
})


usersRouter.post('/', async (request, response) => {
  try {

    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    if (!request.body.password || !request.body.name) {
      response.status(400).send({error: 'name, username or password is missing'})
    } else if (request.body.password.length <= 3) {
      response.status(400).send({error: 'minimum length for password is 3'})
    } else {
      const savedUser = await user.save()
      response.json(savedUser.toJSON())
    }

  } catch (exception) {
    response.status(400).send({error: exception})
  }

})

module.exports = usersRouter