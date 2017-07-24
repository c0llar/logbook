import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import isOnline from './reducers/connectivity'
import { isLoggedIn, token } from './reducers/auth'
import { notes, editorCursor } from './reducers/notes'

const reducers = {
  isOnline,
  isLoggedIn,
  token,
  notes,
  editorCursor
}

const cachedState = JSON.parse(window.localStorage.getItem('STORE_STATE')) || {}

const store = createStore(
  combineReducers(reducers),
  {
    isLoggedIn: cachedState.isLoggedIn || false,
    token: cachedState.token || '',
    notes: cachedState.notes || []
  },
  applyMiddleware(thunk)
)

store.subscribe(() => {
  let state = store.getState()

  if (process.env.NODE_ENV == 'development')
    console.log(state)

  state.notes = (state.notes || []).slice(0, 100)
  window.localStorage.setItem('STORE_STATE', JSON.stringify(state))
})

export default store
