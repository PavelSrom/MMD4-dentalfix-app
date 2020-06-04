import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import AppointmentCard from './AppointmentCard'

const Past = ({ appointments }) =>
  appointments.length > 0 ? (
    <Grid container spacing={6}>
      {/* sort from most to least recent */}
      {appointments
        .sort((a, b) => new Date(b.startAt) - new Date(a.startAt))
        .map((app, index) => (
          <AppointmentCard key={app._id} data={app} index={index} />
        ))}
    </Grid>
  ) : (
    <Typography variant="body1">You have no past appointments</Typography>
  )

export default Past
