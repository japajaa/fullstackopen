import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {
  render, waitForElement
} from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {
  test('if no user logged, blogs are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('login')
    )

    const blogs = component.container.querySelectorAll('.blogHeader')
    expect(blogs.length).toBe(0)
    // expectations here
  })


  test('if user is logged, blogs are rendered', async () => {

    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Donald Tester'
    }

    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

    const component = render(
      <App />
    )



    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('blogs')
    )


    const blogs = component.container.querySelectorAll('.blogHeader')

    expect(component.container).toHaveTextContent('Donald Tester logged in')

    expect(blogs.length).toBe(3)
    // expectations here
  })



})