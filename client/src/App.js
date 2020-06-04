import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { autoLoginUser } from './store/actions/auth'
import PRoute from './hoc/PrivateRoute'
import AlertBox from './components/AlertBox'

// pages
import Register from './pages/Register'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'
import Appointments from './pages/Appointments'
import NewAppointment from './pages/NewAppointment'
import Profile from './pages/Profile'
import Contact from './pages/Contact'

const App = ({ autoLoginUser }) => {
  useEffect(() => {
    // try to automatically login the user if there's token in local storage
    if (localStorage.mmd4_token) autoLoginUser()
    // eslint-disable-next-line
  }, [])

  return (
    <Router>
      <AlertBox />
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/reset" component={ResetPassword} />
        <Route exact path="/reset/:id" component={NewPassword} />
        <PRoute exact path="/appointments" component={Appointments} />
        <PRoute exact path="/appointments/new" component={NewAppointment} />
        <PRoute exact path="/profile" component={Profile} />
        <PRoute exact path="/contact" component={Contact} />
        {/* 404 pages */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  )
}

export default connect(null, { autoLoginUser })(App)
