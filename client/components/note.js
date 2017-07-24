import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'

import {
  deleteNote,
  updateNote,
  setEditorCursor
} from '../actions'

class Note extends Component {
  static propTypes = {
    cursor: PropTypes.string.isRequired
  }

  state = {
    title: this.props.data.title,
    date: moment(this.props.data.date).format('DD MMMM YY HH:mm'),
    text: this.props.data.text
  }

  constructor(props) {
    super(props)
  }

  handleSubmit = (event) => {
    if (event) event.preventDefault()

    const { data, dispatch } = this.props

    const date = moment(this.state.date)

    this.setState({
      date: moment(date.isValid()
                    ?  date.valueOf()
                    : this.props.data.date).format('DD MMMM YY HH:mm')
    })

    dispatch(setEditorCursor(''))
    dispatch(updateNote(
      data._id,
      this.state.title,
      this.state.text,
      date.isValid() ?  date.valueOf() : this.props.data.date
      // moment(this.state.date).valueOf()
    ))
  }

  handleTitleChange = (event) => this.setState({ title: event.target.value })
  handleDateChange = (event) => this.setState({ date: event.target.value })
  handleTextChange = (event) => this.setState({ text: event.target.value })
  formKeyPress = (event) =>
    (event.key == 'Enter') && event.shiftKey ? this.handleSubmit() : ''

  componentWillUnmount() {
    if (this.props.data._id == this.props.cursor)
      this.props.dispatch(setEditorCursor(0))
  }

  render() {
    const { data, dispatch } = this.props

    const isTargeted = data._id == this.props.cursor

    if (isTargeted) {
      return (
        <div className="notes__note-list__note">
          <form onSubmit={this.handleSubmit} >

            <input type="text"
                   autoFocus
                   value={this.state.title}
                   onChange={this.handleTitleChange} />

            <input type="text"
                   value={this.state.date}
                   onChange={this.handleDateChange} />

        {
          ` date will be interpreted as
            ${ moment(this.state.date).isValid()
                  ? moment(this.state.date).format('DD MMMM YY HH:mm')
                  : moment(this.props.date).format('DD MMMM YY HH:mm')
            }
          `
        }

            <textarea
                  value={this.state.text}
                  onChange={this.handleTextChange}
                  onKeyPress={this.formKeyPress}/>

          <div style={{ textAlign: 'center' }}> [ shift+enter to submit ] </ div>
            <input type="submit" style={{visibility: 'hidden'}} />
          </form>
        </div>
      )
    } else {
      return (
        <div className="notes__note-list__note">
          <div className="notes__note-list__note__title">
            { this.state.title } { this.props.data.notSynced ? '| not synced' : '' }
            <div className="notes__note-list__note__title__date">

              <sub className="notes__note-list__note__title__button">
                <a onClick={() => dispatch(setEditorCursor(data._id))}>
                [edit]
                </a>
              </sub>

              <sub className="notes__note-list__note__title__button">
                <a onClick={() => dispatch(deleteNote(data._id))}>
                [delete]
                </a>
              </sub>

              <sub> { ` ${this.state.date} `} </sub>
            </div>
          </div>
          <div className="notes__note-list__note__text">
            { this.state.text }
          </div>
        </div>
      )
    }
  }
}

export default  connect((state) => ({ cursor: state.editorCursor }))(Note)
