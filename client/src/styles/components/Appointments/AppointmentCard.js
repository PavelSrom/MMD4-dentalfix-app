import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    paper: {
      background: '#f2f2f2',
      width: '100%',
      height: '100%',
      maxWidth: 480, // otherwise looks way too large on small screens
      margin: '0 auto', // centered on small screens
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderRadius: theme.spacing(2),
      display: 'flex',
      position: 'relative'
    },
    menuIcon: {
      position: 'absolute',
      top: theme.spacing(0.5),
      right: theme.spacing(0.5)
    },
    dateBox: {
      width: '25%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRight: '1px solid rgba(0,0,0,.12)' // divider color
    },
    bigFatText: {
      color: theme.palette.primary.main,
      fontWeight: 'bolder',
      [theme.breakpoints.down('xs')]: {
        fontSize: 48
      }
    },
    detailsBox: {
      width: '75%',
      padding: `0 ${theme.spacing(1)}px`
    },
    divider: {
      margin: `${theme.spacing(0.5)}px 0`
    }
  }),
  { index: 1 }
)
