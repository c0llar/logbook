import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { logout } from '../actions'

class Controls extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch(logout())
  }

  render() {
    const { location } = this.props

    const navLink = location.pathname.startsWith('/calendar')
        ? <Link to="/notes"
                className="app__controls__navlink"> NOTES </Link>
        : <Link to="/calendar"
                className="app__controls__navlink"> CALENDAR </Link>

    return (
        <div className="app__controls">
          { navLink }
          <a className="app__controls__logout"
             onClick={this.logout} >
            logout
          </a>
          <span className="app__controls__offline">
            { this.props.isOnline ? '' : 'you are being offline' }
          </span>
        </div>
    )
  }
}

export default withRouter(connect((state) => ({isOnline: state.isOnline}))(Controls))
