import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'

import Footer from './footer'
import Sidebar from './sidebar'
import Note from './note'

import {
  addNote,
  getNotes,
  deleteNote,
  updateNote,
  setEditorCursor
} from '../actions'

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired
  }

  state = {
    search: (location.search.split('=')[1] || '').replace('%200', ' ') 
  }

  constructor(props) {
    super(props)

    const { dispatch } = this.props
    dispatch(getNotes())
  }

  newNote = () => {
    const { dispatch } = this.props

    const date = this.props.match.params.date || ''
    const currDate = date ? moment(date, 'DD_MM_YY') : moment()

    dispatch(addNote('Title', 'Text', currDate.valueOf()))
    this.setState({search: ''})
  }

  handleSearchChange = (event) => this.setState({ search: event.target.value })

  render() {
    const { dispatch, notes } = this.props

    const query = this.state.search

    const date = this.props.match.params.date || ''
    const currDate = date ? moment(date, 'DD_MM_YY') : moment()

    const filterByQuery = (notes, query) => {
      query = query.toLowerCase()

      const isInTitle = title => title.toLowerCase().indexOf(query) >= 0
      const isInText = text => text.toLowerCase().indexOf(query) >= 0
      const isInDate = date =>
            moment(date).format('DD MM YY HH:mm').toLowerCase().indexOf(query) >= 0 ||
            moment(date).format('DD MM YYYY HH:mm').toLowerCase().indexOf(query) >= 0 ||
            moment(date).format('DD MMMM YY HH:mm').toLowerCase().indexOf(query) >= 0 ||
            moment(date).format('DD MMMM YYYY HH:mm').toLowerCase().indexOf(query) >= 0

      return notes
        .filter(note => isInTitle(note.title) || isInText(note.text) || isInDate(note.date))
    }

    const todayNotes = date
          ? notes.filter(note => currDate.isSame(moment(note.date), 'day'))
          : notes

    const filteredNotes = query ? filterByQuery(todayNotes, query) : todayNotes

    const Notes = filteredNotes.map(note => <Note data={note} key={note._id} />)

    return (
      <div className="notes">
        <Sidebar />
        <div className="notes__note-list">
          <div className="notes__note-list__search">
            <input type="text"
                   placeholder="search"
                   value={this.state.search}
                   onChange={this.handleSearchChange} />
          </div>
          <div className="notes__note-list__new-note"
               onClick={ this.newNote } >
            <a> [new note]  </a>
          </div>
          { Notes }
          <Footer />
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({ notes: state.notes, cursor: state.editorCursor })
)(Notes)

