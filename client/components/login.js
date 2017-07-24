import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { requestAuth } from '../actions'

class Login extends Component {
  static propTypes = {
    isOnline: PropTypes.bool.isRequired
  }

  state = {
    password: ''
  }

  constructor(props) {
    super(props)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.dispatch(requestAuth(this.state.password))
    this.setState({ password: '' })
  }

  handleChange = (event) => this.setState({ password: event.target.value })

  componentWillMount() {
    this.locationOnEnter = this.props.location.pathname
    this.props.history.replace('/login')
  }

  componentWillUnmount() {
    setTimeout(() => this.props.history.replace(this.locationOnEnter), 0)
  }

  render() {
    if (!this.props.isOnline) {
      return (
        <div className="login">
          <div className="login__greetings"> No internet connection </div>
        </div>
      )
    }

    return (
      <div className="login">
        <div className="login__greetings"> Tell me your secrets </div>
        <form onSubmit={this.handleSubmit} >
          <input type="password"
                 autoFocus
                 value={this.state.password}
                 onChange={this.handleChange} />
        </form>
      </div>
    )
  }
}

export default withRouter(connect((state) => ({ isOnline: state.isOnline }))(Login))
