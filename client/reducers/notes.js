const unionNotes = (A, B) =>
  [ ...new Map(A.concat(B).map(entry => [entry._id, entry])) ].map(e => e[1])

const sortByDate = notes =>
      notes.sort((a, b) => b.date - a.date)

const substractNote = (notes, id) =>
  notes.filter(note => note._id != id)

const modifyNote = (notes, id, title, text, date, notSynced) => {
  return notes.map(note => {
    if (note._id == id) {
      note.title = title
      note.text = text
      note.date = date
      note.notSynced = notSynced
    }
    return note
  })
}

export const notes = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_NOTES':
      return sortByDate(unionNotes(state, action.notes))
    case 'LOG_OUT':
      return []
    case 'DELETE_NOTE':
      return substractNote(state, action.target)
    case 'UPDATE_NOTE':
      return modifyNote(
        state,
        action.target,
        action.title,
        action.text,
        action.date,
        action.notSynced
      )
    default:
      return state
  }
}

export const editorCursor = (state = '', action) => {
  switch (action.type) {
    case 'SET_EDITOR_CURSOR':
      return action.cursor
    default:
      return state
  }
}
