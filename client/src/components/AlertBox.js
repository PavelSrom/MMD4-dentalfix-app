import React from 'react'
import { connect } from 'react-redux'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

// snackbars to be shown on the screen (one at a time)
const AlertBox = ({ alerts }) =>
  alerts.map(({ message, type, id }) => (
    <Snackbar key={id} open autoHideDuration={4000}>
      <Alert variant="filled" severity={type}>
        {message}
      </Alert>
    </Snackbar>
  ))

const mapStateToProps = state => ({
  alerts: state.visual.alerts
})

export default connect(mapStateToProps)(AlertBox)
