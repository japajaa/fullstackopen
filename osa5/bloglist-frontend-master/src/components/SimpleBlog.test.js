import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('renders content', () => {
  const simpleBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Japamies',
    likes: 47
  }

  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog blog={simpleBlog} onClick={mockHandler}/>
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'Japamies'
  )

  expect(component.container).toHaveTextContent(
    '47'
  )
})


test('two clicks === two times FIRE!', () => {
    const simpleBlog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Japamies',
      likes: 48
    }
  
    const mockHandler = jest.fn()
  
    const { getByText } = render(
      <SimpleBlog blog={simpleBlog} onClick={mockHandler}/>
    )

    const button = getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls.length).toBe(2)

  })
