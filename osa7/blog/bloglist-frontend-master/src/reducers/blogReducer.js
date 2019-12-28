const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'VOTE':
    return state.filter(n => n.id !== action.data.id).concat(action.data)
  case 'COMMENT':
    return state.filter(n => n.id !== action.data.id).concat(action.data)
  case 'DELETE':
    return state.filter(n => n.id !== action.data.id)
  case 'ADD':
    return state.concat(action.data)
  case 'INITIALIZE':
    return action.data
  default: // jos ei mikään ylläolevista tullaan tänne
    return state
  }
}

export const initializeBlogs = (blogs) => {
  return {
    type: 'INITIALIZE',
    data: blogs
  }
}

export const addBlog = (blog) => {
  return {
    type: 'ADD',
    data: blog
  }
}

export const voteBlog = (blog) => {
  return {
    type: 'VOTE',
    data: blog
  }
}

export const deleteBlog = (blogid) => {
  return {
    type: 'DELETE',
    data: { id: blogid }
  }
}


export const addComment = (blog) => {
  return {
    type: 'COMMENT',
    data: blog
  }
}


export default blogReducer