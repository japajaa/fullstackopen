const notificationReducer = (state = {}, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    state = action.data
    return action.data
  default: // jos ei mikään ylläolevista tullaan tänne
    return state
  }
}

export const setNotification = (notification) => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      text: notification.text,
      color: notification.color
    }
  }
}

export default notificationReducer