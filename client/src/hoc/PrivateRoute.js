import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import WithLayout from './WithLayout'

// higher-order component that checks user's authentication status
// e.g. if I'm not logged in, it doesn't let me go to pages that should be private
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <WithLayout>
          <Component {...props} />
        </WithLayout>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
)

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(PrivateRoute)
