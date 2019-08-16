import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('Blog component', () => {
  
  let component
  beforeEach(() => {

    
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
  
    component = render(
      <Blog user={user} blogs={blogs} blog={blog} setBlogs={mockHandler}/>
    )


  })

  afterEach(cleanup)

test('renders content', () => {
  
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
  


test('at start the details are not displayed', () => {
  const div = component.container.querySelector('.togglableContent')

  expect(div).toHaveStyle('display: none')

})

test('after clicking the button, details are displayed', () => {
    const divToClick = component.container.querySelector('.blogHeader')
    fireEvent.click(divToClick)
  
    const details = component.container.querySelector('.togglableContent')
    expect(details).not.toHaveStyle('display: none')
})

})
