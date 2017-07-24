const isOnline = (state = navigator.onLine, action) => {
  switch (action.type) {
    case 'UPDATE_CONNECTIVITY_STATE':
      return navigator.onLine
    default:
      return state
  }
}

export default isOnline
