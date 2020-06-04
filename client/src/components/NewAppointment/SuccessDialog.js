import React from 'react'
import { useHistory } from 'react-router-dom'
import { Dialog, Typography, DialogContent, DialogActions } from '@material-ui/core'
import { RoundedButton } from '../../templates/buttons'
import { CheckCircleOutline } from '../../templates/icons'
import useStyles from '../../styles/components/NewAppointment/SuccessDialog'

const SuccessDialog = ({ open, setOpen }) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Dialog
      PaperProps={{ style: { borderRadius: 16 } }}
      open={open}
      disableEscapeKeyDown
      disableBackdropClick
      fullWidth
      maxWidth="xs"
    >
      <DialogContent dividers>
        <CheckCircleOutline className={classes.successIcon} />
        <Typography variant="h4" className={classes.confirmMessage}>
          Success!
        </Typography>
        <Typography variant="body1" className={classes.descText}>
          You have booked an appointment
        </Typography>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <RoundedButton
          color="secondary"
          variant="outlined"
          onClick={() => setOpen(false)}
          className={classes.actionBtn}
        >
          Make another one
        </RoundedButton>
        <RoundedButton
          color="primary"
          variant="outlined"
          onClick={() => history.push('/appointments')}
        >
          Awesome!
        </RoundedButton>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessDialog
