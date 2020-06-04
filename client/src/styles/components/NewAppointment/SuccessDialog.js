import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    successIcon: {
      fontSize: theme.spacing(24),
      display: 'block',
      margin: '0 auto',
      color: theme.palette.primary.main,
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(16)
      }
    },
    confirmMessage: {
      color: theme.palette.primary.main,
      textAlign: 'center',
      fontWeight: 'bolder',
      [theme.breakpoints.down('sm')]: {
        fontSize: 24
      }
    },
    descText: {
      color: theme.palette.primary.main,
      textAlign: 'center'
    },
    actions: {
      padding: 12,
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column'
      }
    },
    actionBtn: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: 12
      }
    }
  }),
  { index: 1 }
)
