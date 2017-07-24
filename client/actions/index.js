export const setAuthState = (state, token) => {
  return { type: 'SET_AUTH_STATE', isAuthenticated: state, token }
}

export const logout = () => {
  return dispatch => {
    dispatch(setAuthState(false, ''))
    dispatch({ type: 'LOG_OUT' })
  }
}

export const setEditorCursor = (noteId) => {
  return { type: 'SET_EDITOR_CURSOR', cursor: noteId }
}

//  SERVER API

const request = (api, method, params, token) => {
  return fetch(
    `/api/${api}`,
    {
      method: method,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'x-access-token' : token
      },
      ...(params ? { body: JSON.stringify(params) } : {})
    }).then(res => res.json())
    .catch(err => console.log(err))
}

export const requestAuth = (password) => {
  return (dispatch, getState) => {
    request('auth', 'POST', { password })
      .then(res => res.success ? dispatch(setAuthState(true, res.token)) : '')
  }
}

export const addNote = (title, text, date, suppressEditing = false) => {
  return (dispatch, getState) => {
    const { token, isOnline } = getState()

    if (isOnline) {
      request('note', 'POST', { title, text, date}, token)
        .then(res => {
          dispatch({ type: 'UPDATE_NOTES', notes: [res.note] })
          if (!suppressEditing)
            dispatch(setEditorCursor(res.note._id))
        })
    } else {
      const fakeId = Math.random().toString(36).substring(7)

      dispatch({
        type: 'UPDATE_NOTES',
        notes: [{_id: fakeId, title, text, date, notSynced: true }]
      })

      dispatch(setEditorCursor(fakeId))
    }
  }
}

export const getNotes = (offset, lastUpdate) => {
  return (dispatch, getState) => {
    const { token, notes } = getState()

    lastUpdate = Math.max(...notes.map(note => note.createdAt)) || 0

    request(`notes?lastUpdate=${lastUpdate}`, 'GET', null, token)
      .then(res => dispatch({ type: 'UPDATE_NOTES', notes: res.notes }))
  }
}

export const updateNote = (id, title, text, date) => {
  return (dispatch, getState) => {
    const { token, isOnline } = getState()

    if (isOnline) {
      request('note/update', 'POST', { id, title, text, date }, token)
        .then(res => dispatch({ type: 'UPDATE_NOTE', target: id, title, text, date }))
    } else {
      dispatch({ type: 'UPDATE_NOTE', target: id, title, text, date, notSynced: true })
    }
  }
}

export const deleteNote = (id) => {
  return (dispatch, getState) => {
    const { token, isOnline } = getState()

    if (isOnline) {
      request('note/delete', 'POST', { id }, token)
        .then(res => dispatch({ type: 'DELETE_NOTE', target: id }))
    } else {
      dispatch({ type: 'DELETE_NOTE', target: id })
    }
  }
}
