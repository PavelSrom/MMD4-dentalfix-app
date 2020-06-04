import React, { useState } from 'react'
import { connect } from 'react-redux'
import { deleteAppointment } from '../../store/actions/appointments'
import useStyles from '../../styles/components/Appointments/AppointmentCard'
import { format, sub } from 'date-fns'
import { MoreVert } from '../../templates/icons'
import {
  Grid,
  Paper,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Grow
} from '@material-ui/core'

// helper components
const SmallText = ({ children }) => (
  <Typography variant="body2" style={{ color: '#999', marginBottom: 8 }}>
    {children}
  </Typography>
)
const DataText = ({ children }) => <Typography variant="body1">{children}</Typography>

const AppointmentCard = ({
  data: { _id, treatment, patientName, startAt, message },
  loading,
  index,
  deleteAppointment
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  // if it's more than 24h to the appointment, it can be deleted
  const canBeDeleted = sub(new Date(startAt), { days: 1 }) > new Date()

  return (
    <Grid item xs={12} md={6} xl={4}>
      <Grow in={true} timeout={(index + 1) * 250}>
        <Paper className={classes.paper}>
          <div className={classes.dateBox}>
            <Typography variant="h6">{format(new Date(startAt), 'MMM')}</Typography>
            <Typography variant="h2" className={classes.bigFatText}>
              {format(new Date(startAt), 'd')}
            </Typography>
            <Typography variant="h6">{format(new Date(startAt), 'EEE')}</Typography>
          </div>
          <div className={classes.detailsBox}>
            <div>
              <SmallText>Timing</SmallText>
              <DataText>{format(new Date(startAt), 'hh:mm a')}</DataText>
            </div>

            <Divider className={classes.divider} />

            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%', paddingRight: 8 }}>
                <SmallText>For</SmallText>
                <DataText>{patientName}</DataText>
              </div>
              <div style={{ width: '50%' }}>
                <SmallText>Treatment</SmallText>
                <DataText>{treatment}</DataText>
              </div>
            </div>

            <Divider className={classes.divider} />

            <div>
              <SmallText>Message</SmallText>
              <DataText>{message}</DataText>
            </div>
          </div>

          {/* menu icon only visible if it's more than 24h to the appointment */}
          {canBeDeleted && (
            <>
              <IconButton
                onClick={e => setAnchorEl(e.currentTarget)}
                className={classes.menuIcon}
              >
                <MoreVert color="primary" />
              </IconButton>

              <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
              >
                {/* source: client/src/components/Appointments/AppointmentCard.js */}
                <MenuItem disabled={loading} onClick={() => deleteAppointment(_id)}>
                  Cancel appointment
                </MenuItem>
              </Menu>
            </>
          )}
        </Paper>
      </Grow>
    </Grid>
  )
}

const mapStateToProps = state => ({
  loading: state.visual.loading.cancelApp
})

export default connect(mapStateToProps, { deleteAppointment })(AppointmentCard)
