  
  const initialState = ''

  export const voteNotification = (content) => {
    return {
      type: 'VOTE_NOTIFICATION',
      data: { content: content }
    }
  }

  export const createNotificationOld = (content) => {
    return {
      type: 'CREATE_NOTIFICATION',
      data: { content: content }
    }
  }



  export const setNotification = (notificationContent, timeToShow) => {
    return async dispatch => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: {content: notificationContent}
      })
      setTimeout(() => {
        dispatch({
          type: 'SET_NOTIFICATION',
          data: {content: ''}
        })
      }, timeToShow * 1000)

    }
  }


  export const resetNotification = () => {
    return {
      type: 'RESET_NOTIFICATION'
    }
  }
  
  const reducer = (state = initialState, action) => {
  
    switch(action.type) {
      case 'RESET_NOTIFICATION':
          state = ''
          return state
      case 'VOTE_NOTIFICATION':
          state = `You voted '${action.data.content}'`
          return state
      case 'CREATE_NOTIFICATION':
          state = `You created '${action.data.content}'`      
          return state
      case 'SET_NOTIFICATION':
              state = action.data.content      
              return state
      default:
        return state
    }
  
  }
  
  export default reducer