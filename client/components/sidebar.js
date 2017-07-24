import React, { Component } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import moment from 'moment'

const Entry = ({ date, count, selected }) =>
  <Link to={`/notes/${date.replace(/\//g, '_')}`}
        className={ selected ? 'notes__sidebar__date_selected' : ''} >
    <div className={ count == 0
                      ? 'notes__sidebar__date_no-notes'
                      : 'notes__sidebar__date' } >
      { date } <sup>{ count }</sup>
    </div>
  </Link>

class Sidebar extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired
  }

  state = {
    height: 0
  }

  updateHeight = () => this.setState({ height: window.innerHeight })

  componentDidMount() {
    this.updateHeight()
    window.addEventListener("resize", this.updateHeight)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateHeight)
  }

  render() {
    const { notes } = this.props
    const count = Math.floor(this.state.height / 22)

    const ALL_SELECTED = !this.props.match.params.date

    const date = this.props.match.params.date || ''

    const selectedDate = date ? moment(date, 'DD_MM_YY') : undefined


    const thirtyDays = Array(count).fill()
          .map((_, i) => moment(selectedDate).subtract(i - Math.ceil(count / 2) + 2, 'd'))

    const notesThisDay = day =>
          notes.filter(note => day.isSame(moment(note.date), 'd')).length

    const stats = thirtyDays
          .map(date => ({
            date: date.format('DD/MM/YY'),
            count: notesThisDay(date),
            selected: ALL_SELECTED ?  false : date.isSame(selectedDate, 'd')
          }))

    const entries = stats
          .map(({ date, count, selected }, i) =>
               <Entry date={date} count={count} selected={selected} key={i} />)

    return (
      <div className="notes__sidebar">
        <Link to="/notes" >
          <div className= { ALL_SELECTED
                            ? 'notes__sidebar__date_selected'
                            : 'notes__sidebar__date' }>
            All Notes
          </div>
        </Link>
        { entries }
      </div>
    )
  }
}

export default withRouter(connect((state) => ({notes: state.notes}))(Sidebar))
