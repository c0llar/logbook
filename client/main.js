import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import Store from './store'
import App from './components/app'

render(
  <Provider store={Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#react-app-root')
)

// Register service worker
if ('serviceWorker' in navigator)
  window.addEventListener('load', _ =>
    navigator.serviceWorker
      .register('sw.js')
      .then(registration => console.log('service worker registred', registration.scope))
      .catch(err => console.log('service worker error', err)))

// Connectivity status handlers
const updateConnectivity = () => Store.dispatch({ type: 'UPDATE_CONNECTIVITY_STATE' })

if ('onLine' in navigator)
  ['online', 'offline'].map(event => window.addEventListener(event, updateConnectivity))

// Sync notes
import { addNote, setEditorCursor } from './actions'

const syncNotes = () => {
  const notSyncedNotes = Store.getState().notes.filter(note => note.notSynced)
  for (let note of notSyncedNotes) {
    console.log(note)

    Store.dispatch(addNote(note.title, note.text, note.date, true))
    Store.dispatch({ type: 'DELETE_NOTE', target: note._id })
  }
}

if ('onLine' in navigator) {
  if (navigator.onLine) syncNotes()
  window.addEventListener('online', syncNotes)
}

