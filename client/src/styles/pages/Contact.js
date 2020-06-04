import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    headline: {
      marginBottom: theme.spacing(6)
    },
    flex: {
      height: '100%',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      }
    },
    info: {
      width: '55%',
      paddingRight: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        paddingRight: theme.spacing(2)
      }
    },
    mapContainer: {
      width: '45%',
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    map: {
      width: '100%',
      height: '100%',
      minHeight: 480,
      border: 'none'
    },
    description: {
      fontSize: 18,
      fontWeight: 300,
      marginBottom: theme.spacing(6),
      [theme.breakpoints.down('xs')]: {
        fontSize: 16
      }
    },
    infoIcon: {
      fontSize: 48,
      color: theme.palette.primary.main,
      marginRight: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        marginRight: theme.spacing(2),
        fontSize: 48
      }
    },
    iconText: {
      fontSize: 20,
      [theme.breakpoints.down('xs')]: {
        fontSize: 16
      }
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(3)
    }
  }),
  { index: 1 }
)
