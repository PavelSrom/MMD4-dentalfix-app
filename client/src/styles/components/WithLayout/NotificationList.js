import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    relative: {
      width: 300,
      position: 'relative',
      top: 8,
      [theme.breakpoints.down('xs')]: {
        top: 0
      }
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(0.5)
    }
  }),
  { index: 1 }
)
