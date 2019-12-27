const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

const initialUsers = [
    {
    name: "Japa Repolainen",
    username: "japajaa",
    passwordHash: "sdgsfagfga"
    },
    {
    name: "Uuno Turhapuro",
    username: "uuno666",
    passwordHash: "sfsgfgafgaga"
    }
]

describe('users', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    let userObject = new User(initialUsers[0])
    await userObject.save()

    userObject = new User(initialUsers[1])
    await userObject.save()
  })

  test('are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  
  test('identifier is called id', async () => {
    const resultUser = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
      expect(resultUser.body[0].id).toBeDefined()
  })

  test('that are fine can be added ', async () => {
  const newUser = {
    name: "Aku Ankka",
    username: "akuankk",
    password: "IinesOnIhq"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    const usernames = response.body.map(r => r.username)
    
    expect(response.body.length).toBe(initialUsers.length + 1)
    expect(usernames).toContain(
      'akuankk'
    )
})

test('without username and/or password are not added', async () => {
  const newUserNoUsername = {
    name: "Test user no username",
    password: "asdf"
  }

  const newUserNoPassword = {
    name: "Test user no pw",
    username: "rooankk"
  }

  const newUserNoUsernameOrPassword = {
    name: "Test user no username or password"
  }

  await api
    .post('/api/users')
    .send(newUserNoUsername)
    .expect(400)

    await api
    .post('/api/users')
    .send(newUserNoPassword)
    .expect(400)

    await api
    .post('/api/users')
    .send(newUserNoUsernameOrPassword)
    .expect(400)

    const response = await api.get('/api/users')
    expect(response.body.length).toBe(initialUsers.length)
})

test('with password shorter than three are not added', async () => {

    const newUserShortPass0 = {
      name: "User with empty password",
      username: "shorty0",
      password: ""
    }

    const newUserShortPass1 = {
      name: "User with password with 1 character",
      username: "shorty1",
      password: "a"
    }

    const newUserShortPass2 = {
      name: "User with password with 2 characters",
      username: "shorty2",
      password: "ab"
    }

    const newUserShortPass3 = {
      name: "User with password with 3 characters",
      username: "shorty3",
      password: "abcd"
    }

    const responseAtStart = await api.get('/api/users')

    await api
    .post('/api/users')
    .send(newUserShortPass0)
    .expect(400)

    await api
    .post('/api/users')
    .send(newUserShortPass1)
    .expect(400)

    await api
    .post('/api/users')
    .send(newUserShortPass2)
    .expect(400)
    
    await api
    .post('/api/users')
    .send(newUserShortPass3)
    .expect(200)

    const responseAtEnd = await api.get('/api/users')

    expect(responseAtStart.body.length + 1).toBe(responseAtEnd.body.length)

})

})

afterAll(() => {
  mongoose.connection.close()
})