import React from 'react'
import { makeStyles, Backdrop, CircularProgress, Grid, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles(
  theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.secondary.main
    },
    skeletonPaper: {
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      display: 'flex',
      padding: theme.spacing(2)
    }
  }),
  { index: 1 }
)

export const BackdropSpinner = () => {
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export const AppointmentsSpinner = () => {
  const classes = useStyles()

  return (
    <Grid container spacing={6}>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <Grid key={index} item xs={12} lg={6} xl={4}>
          <Paper className={classes.skeletonPaper}>
            <Skeleton variant="rect" width={'20%'} height={200} />
            <div style={{ width: '80%', paddingLeft: 16 }}>
              <Skeleton variant="text" width={'100%'} height={64} />
              <Skeleton variant="text" width={'100%'} height={64} />
              <Skeleton variant="text" width={'100%'} height={64} />
            </div>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
