  
  const initialState = ''

  export const changeFilter = (filterText) => {
    return {
      type: 'FILTER',
      data: { filterText: filterText }
    }
  }
  
  const reducer = (state = initialState, action) => {
  
    switch(action.type) {
      case 'FILTER':
          state = action.data.filterText
          return state
      default:
        return state
    }
  
  }
  
  export default reducer