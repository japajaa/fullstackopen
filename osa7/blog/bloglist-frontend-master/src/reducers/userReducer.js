const userReducer = (state = {}, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  default: // jos ei mikään ylläolevista tullaan tänne
    return state
  }
}

export const setUserRedux = (user) => {
  return {
    type: 'SET_USER',
    data: user
  }
}

export default userReducer