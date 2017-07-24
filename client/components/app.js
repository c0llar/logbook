import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'

import Controls from './controls'
import Calendar from './calendar'
import Notes from './notes'
import Login from './login'

const DefaultRoute = () => <Redirect to={'/notes'} />

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
  }

  render() {
    return this.props.isLoggedIn ? (
      <div className="app">
        <Controls />
        <Switch>
          <Route path="/calendar/:year?" component={Calendar} />
          <Route path="/notes/:date?" component={Notes} />
          <Route component={DefaultRoute} />
        </Switch>
      </div>
    ) : (
      <Login />
    )
  }
}

export default withRouter(connect((state) => ({isLoggedIn: state.isLoggedIn}))(App))
