import { makeStyles } from '@material-ui/core'

const drawerWidth = 280

export default makeStyles(
  theme => ({
    root: {
      display: 'flex'
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#F2F2F2',
      boxShadow: '0.5px 1px 5px gray'
    },
    active: {
      color: theme.palette.primary.main,
      fontWeight: 'bold'
    },
    logo: {
      maxWidth: '100%',
      maxHeight: 144,
      marginTop: theme.spacing(5)
    },
    tolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      display: 'flex',
      alignItems: 'center'
    },
    signOutBtn: {
      position: 'absolute',
      bottom: theme.spacing(2),
      left: theme.spacing(2)
    },
    main: {
      background: '#fff',
      marginTop: 64,
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      [theme.breakpoints.down('xs')]: {
        marginTop: 56
      }
    },
    badge: {
      color: '#fff'
    }
  }),
  { index: 1 }
)
