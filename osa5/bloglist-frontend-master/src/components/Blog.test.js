import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Blog from './Blog'

afterEach(cleanup)

test('renders content', () => {
  const blog = {
    title: 'My very nice blog',
    author: 'Japamies',
    url: 'http://iltalehti.fi',
    likes: 47,
    user: {
        username: 'mikmall',
        name: 'Mikko Mallikas'
    }
  }

  const blogs = []

  const user = {
    name: 'Uuno Turhapuro',
    username: 'uunturh'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog user={user} blogs={blogs} blog={blog} setBlogs={mockHandler}/>
  )

  expect(component.container).toHaveTextContent(
    'My very nice blog'
  )

  expect(component.container).toHaveTextContent(
    'Japamies'
  )

  expect(component.container).toHaveTextContent(
    '47'
  )
})