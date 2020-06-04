import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    paper: {
      padding: theme.spacing(6),
      maxWidth: 960,
      margin: '0 auto',
      background: '#f2f2f2',
      borderRadius: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2)
      }
    },
    header: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      }
    },
    avatarBox: {
      borderRight: '1px solid rgba(0,0,0,.12)',
      paddingRight: theme.spacing(6),
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        paddingRight: 0,
        borderRight: 'none',
        justifyContent: 'center'
      }
    },
    avatar: {
      width: theme.spacing(16), // 128px
      height: theme.spacing(16),
      fontSize: theme.spacing(6)
    },
    basicInfo: {
      paddingLeft: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
        marginTop: theme.spacing(3),
        textAlign: 'center'
      }
    },
    basicInfoText: {
      fontSize: 24,
      marginBottom: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        fontSize: 20
      }
    },
    bolder: {
      fontWeight: 'bolder',
      color: theme.palette.primary.main
    },
    divider: {
      margin: `${theme.spacing(6)}px 0`
    },
    actionButtons: {
      display: 'flex',
      marginTop: theme.spacing(8),
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-end'
      }
    },
    deleteProfileBtn: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(2)
      }
    },
    form: {
      [theme.breakpoints.down('sm')]: {
        maxWidth: 480,
        margin: '0 auto'
      }
    }
  }),
  { index: 1 }
)
