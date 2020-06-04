import { makeStyles } from '@material-ui/core'
import banner from '../../assets/register_login_banner.jpg'

export default makeStyles(
  theme => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      }
    },
    banner: {
      order: 2,
      minHeight: 500,
      backgroundImage: `url(${banner})`,
      backgroundSize: 'cover',
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%'
      }
    },
    formContainer: {
      order: 1,
      width: '50%',
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      [theme.breakpoints.down('md')]: {
        width: '100%'
      }
    },
    logo: {
      display: 'block',
      margin: '0 auto'
    },
    headline: {
      marginTop: theme.spacing(5),
      textAlign: 'center',
      marginBottom: theme.spacing(5)
    },
    submitBtn: {
      display: 'block',
      margin: '0 auto'
    },
    linkRedirect: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 'bolder'
    },
    forgotPassword: {
      color: '#333',
      textDecoration: 'none'
    },
    textField: {
      marginBottom: theme.spacing(6)
    }
  }),
  { index: 1 }
)
