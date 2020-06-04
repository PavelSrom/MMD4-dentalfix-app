import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import AppointmentCard from './AppointmentCard'

const Upcoming = ({ appointments }) =>
  appointments.length > 0 ? (
    <Grid container spacing={6}>
      {appointments.map((app, index) => (
        <AppointmentCard key={app._id} data={app} index={index} />
      ))}
    </Grid>
  ) : (
    <Typography variant="body1">You have no upcoming appointments</Typography>
  )

export default Upcoming
