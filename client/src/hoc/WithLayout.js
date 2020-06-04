import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../store/actions/auth'
import { getNotifications } from '../store/actions/notifications'
import { getMyAppointments } from '../store/actions/appointments'
import useStyles from '../styles/hoc/WithLayout'
import NotificationList from '../components/WithLayout/NotificationList'
import logo from '../assets/logo_192x192.png'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import {
  Today,
  Person,
  Call,
  ExitToApp,
  Menu,
  Notifications,
  Add
} from '../templates/icons'
import {
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Badge,
  useTheme,
  Button,
  Typography,
  Tooltip
} from '@material-ui/core'

const WithLayout = ({
  children,
  notifications,
  getNotifications,
  getMyAppointments,
  logoutUser
}) => {
  // HOOKS
  const classes = useStyles()
  const theme = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifsOpen, setNotifsOpen] = useState(null)
  // const container = window !== undefined ? () => window().document.body : undefined

  // ====================================================================================

  // LIFECYCLES
  useEffect(() => {
    getNotifications()
    getMyAppointments()
    // eslint-disable-next-line
  }, [])

  // ====================================================================================

  // EVENT HANDLERS
  const handleSignOut = () => {
    logoutUser()
  }

  const links = [
    {
      url: '/appointments/new',
      label: 'New appointment',
      icon: <Add />
    },
    {
      url: '/appointments',
      label: 'Appointments',
      icon: <Today />
    },
    {
      url: '/profile',
      label: 'Profile',
      icon: <Person />
    },
    {
      url: '/contact',
      label: 'Contact',
      icon: <Call />
    }
  ]

  const currentPage = links.findIndex(({ url }) => url === location.pathname)

  // ====================================================================================

  // JSX
  const drawer = (
    <>
      {/* <div> for logo */}
      <div className={classes.toolbar} style={{ minHeight: 128, display: 'flex' }}>
        <Link to="/" style={{ display: 'block', margin: '0 auto' }}>
          <LazyLoadImage
            className={classes.logo}
            width={144}
            height={144}
            src={logo}
            alt=""
          />
        </Link>
      </div>

      {/* navigation items */}
      <List style={{ marginTop: 48 }}>
        {links.map(({ url, label, icon }, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to={url}
            className={classes.listItem}
            onClick={() => setMobileOpen(false)}
          >
            {/* if it's the current URL, the colors are blue */}
            <ListItemIcon className={location.pathname === url ? classes.active : null}>
              {icon}
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  style={location.pathname === url ? null : { fontWeight: 400 }}
                  className={location.pathname === url ? classes.active : null}
                  variant="h6"
                >
                  {label}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button
        className={classes.signOutBtn}
        color="primary"
        startIcon={<ExitToApp />}
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.tolbar}>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          </Hidden>

          <Typography variant="h5" style={{ color: '#fff' }}>
            {links[currentPage].label}
          </Typography>

          {/* notification bell and sign out button */}
          <div style={{ marginLeft: 'auto' }}>
            <Tooltip title="Notifications" placement="left">
              <IconButton
                edge="end"
                onClick={e => setNotifsOpen(notifsOpen ? null : e.currentTarget)}
              >
                <Badge
                  badgeContent={
                    notifications.length > 0 ? (
                      <span style={{ color: '#fff' }}>{notifications.length}</span>
                    ) : null
                  }
                  color="secondary"
                  className={classes.badge}
                >
                  <Notifications style={{ color: '#fff' }} />
                </Badge>
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="main navigation">
        <Hidden mdUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={() => setMobileOpen(!mobileOpen)}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      {/* the actual content of the route */}
      <main className={classes.main}>{children}</main>

      {/* notification popup */}
      <NotificationList
        open={Boolean(notifsOpen)}
        setOpen={setNotifsOpen}
        anchorEl={notifsOpen}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  notifications: state.notifications.notifications
})

export default connect(mapStateToProps, {
  getNotifications,
  getMyAppointments,
  logoutUser
})(WithLayout)
