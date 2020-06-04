import React, { useState } from 'react'
import { connect } from 'react-redux'
import { deleteNotification } from '../../store/actions/notifications'
import { format } from 'date-fns'
import { SpinnerButton } from '../../templates/buttons'
import useStyles from '../../styles/components/WithLayout/NotificationList'
import {
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  Typography,
  Divider
} from '@material-ui/core'

const NotificationList = ({
  open,
  setOpen,
  anchorEl,
  notifications,
  loading,
  deleteNotification
}) => {
  const [notifToDelete, setNotifToDelete] = useState('')
  const classes = useStyles()

  const renderNotifications = () =>
    notifications.map(({ _id, title, message, createdAt }) => (
      <div key={_id}>
        <Divider />
        <div style={{ padding: '8px 8px 0 8px' }}>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="body2">{message}</Typography>
          <div className={classes.flex}>
            <Typography variant="caption">
              {format(new Date(createdAt), 'MMM d y, hh:mm a')}
            </Typography>
            <SpinnerButton
              loading={loading && _id === notifToDelete}
              color="secondary"
              onClick={() => {
                setNotifToDelete(_id)
                deleteNotification(_id)
              }}
            >
              OK
            </SpinnerButton>
          </div>
        </div>
      </div>
    ))

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top-end"
      transition
      style={{ zIndex: 50 }}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={() => setOpen(null)}>
          <Grow {...TransitionProps} timeout={350} className={classes.relative}>
            <Paper style={{ maxHeight: 480, overflow: 'auto' }} elevation={3}>
              <div style={{ padding: 8 }}>
                <Typography
                  variant="body1"
                  color="primary"
                  style={{ fontWeight: 'bold' }}
                >
                  Your notifications
                </Typography>
              </div>

              {/* outputing notifications */}
              {notifications.length > 0 ? (
                renderNotifications()
              ) : (
                <Typography variant="body2" style={{ marginLeft: 8 }}>
                  You have no notifications
                </Typography>
              )}
            </Paper>
          </Grow>
        </ClickAwayListener>
      )}
    </Popper>
  )
}

const mapStateToProps = state => ({
  notifications: state.notifications.notifications,
  loading: state.visual.loading.deleteNotif
})

export default connect(mapStateToProps, { deleteNotification })(NotificationList)
