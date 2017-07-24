export const isLoggedIn = (state = false, action) => {
  switch (action.type) {
    case 'SET_AUTH_STATE':
      return action.isAuthenticated
    default:
      return state
  }
}

export const token = (state = '', action) => {
  switch (action.type) {
  case 'SET_AUTH_STATE':
    return action.token
  default:
    return state
  }
}

