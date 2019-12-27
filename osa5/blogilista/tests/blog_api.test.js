const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Mökkiläiset",
    author: "Japa",
    url: "http://mokkilaiset.blogspot.com",
    likes: 666
    },
    {
    title: "Megablogi",
    author: "Uuno turhapuro",
    url: "http://megablogi.blogspot.com",
    likes: 47
    },
    {
    title: "My blog",
    author: "Erkki Esimerkki",
    url: "http://myblog.blogspot.com",
    likes: 100
    }
]


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()


})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('identifier is called id', async () => {
  const resultBlog = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(resultBlog.body[0].id).toBeDefined()
})


test('a valid blog can be added ', async () => {

  const newUser = {
    name: "Aku Ankka",
    username: "akuankk",
    password: "IinesOnIhq"
  }

  await api
    .post('/api/users')
    .send(newUser)

const user =
{
  "username": "akuankk",
  "password": "IinesOnIhq"
}

const authResponse = await api
.post('/api/login')
.send(user)

  const newBlog = {
    title: "Added in test",
    author: "Test user",
    url: "http://testblog.blogspot.com",
    likes: 6
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain(
      'Added in test'
    )
})


test('if likes are not defined, likes are 0', async () => {
  const newBlog = {
    title: "naonfa Added in test, with no likes",
    author: "Test user",
    url: "http://ftestblog.blogspot.com"
  }

  const user =
{
  "username": "akuankk",
  "password": "IinesOnIhq"
}


const authResponse = await api
.post('/api/login')
.send(user)



  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    console.log(response.body)
    const likes = response.body.map(r => r.likes)
    
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(likes[3]).toBe(0)
})

test('blog without title and/or url is not added', async () => {

  const user =
  {
    "username": "akuankk",
    "password": "IinesOnIhq"
  }
  
  const authResponse = await api
  .post('/api/login')
  .send(user)
  

  

  const newBlogNoTitleOrUrl = {
    author: "Test user",
    likes: 7
  }

  const newBlogNoTitle = {
    author: "Test user",
    likes: 7,
    url: "fasfa.fd.com"
  }

  const newBlogNoUrl = {
    author: "Test user",
    likes: 7,
    title: "niceblog"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlogNoTitleOrUrl)
    .expect(400)

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlogNoTitle)
    .expect(400)

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlogNoUrl)
    .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

test('delete chosen blog', async () => {


  const user =
  {
    "username": "akuankk",
    "password": "IinesOnIhq"
  }
  
  const authResponse = await api
  .post('/api/login')
  .send(user)
  
  const newBlog = {
    title: "Added in test, with no likes",
    author: "Aku Ankka",
    url: "http://testblog.blogspot.com"
  }

  const newBlogCreated = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  
  const response = await api.get('/api/blogs')
  //const blogToDelete = response.body[0]
  const blogToDelete = newBlogCreated.body

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${authResponse.body.token}`)
    .expect(204)


    const responseAtEnd = await api.get('/api/blogs')

    const titles = responseAtEnd.body.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
    
    expect(response.body.length).toBe(responseAtEnd.body.length + 1)

})

test('update chosen blog', async () => {

  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0]
  const originalLikes = blogToUpdate.likes
  blogToUpdate.likes++


  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  const responseAtEnd = await api.get(`/api/blogs/`)

  const likesAtEnd = responseAtEnd.body[0].likes

  expect(likesAtEnd).toBe(originalLikes + 1)
  expect(response.body.length).toBe(responseAtEnd.body.length)

})

afterAll(() => {
  mongoose.connection.close()
})