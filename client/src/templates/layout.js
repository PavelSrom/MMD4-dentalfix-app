import React from 'react'
import { makeStyles, Container } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
      }
    }
  }),
  { index: 1 }
)

export const PageContainer = ({ children, ...rest }) => {
  const classes = useStyles()

  return (
    <Container maxWidth="lg" {...rest} className={classes.container}>
      {children}
    </Container>
  )
}
