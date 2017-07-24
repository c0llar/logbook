import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import moment from 'moment'

import Footer from './footer'

const Header = ({ selectedYear }) =>
  <div className="calendar__header">
    <Link to={`/calendar/${Number(selectedYear) - 1}`}>
      <sub> { Number(selectedYear) - 1 } </sub>
    </Link>
    <span className="calendar__header__selected-year"> { selectedYear } </span>
    <Link to={`/calendar/${Number(selectedYear) + 1}`}>
      <sub> { Number(selectedYear) + 1 } </sub>
    </Link>
  </div>

const Month = ({ month, year, count }) => {
  const link = '/notes'
        .concat('?search=')
        .concat(moment(`${month} ${year}`).format('MMMM YYYYY'))

  return (
    <Link to={link} >
      <div className="calendar__month"> { month } <sup>{ count }</sup> </div>
    </Link>
  )
}

class Calendar extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { notes } = this.props

    const selectedYear = this.props.match.params.year || moment().format('YYYY')

    const months = Array(12).fill(0).map((_, i) => moment({ y: selectedYear, M: i }))

    const notesThisMonth = day =>
          notes.filter(note => day.isSame(moment(note.date), 'M')).length

    const stats = months
          .map(month => ({ month: month.format('MMMM'), count: notesThisMonth(month) }))

    const entries = stats
          .map(({ month, count }, i) =>
               <Month month={month} year={selectedYear} count={count} key={i} />)

    return (
      <div className="calendar">
        <Header selectedYear={selectedYear} />
        <div className="calendar__months">
          { entries }
        </div>
        <Footer />
      </div>
    )
  }
}


export default connect((state) => ({notes: state.notes}))(Calendar)
