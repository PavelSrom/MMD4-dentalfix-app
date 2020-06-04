import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { connect } from 'react-redux'
import {
  getDoctorSchedule,
  createAppointment,
  initialFormState
} from '../store/actions/appointments'
import { setAlert } from '../store/actions/visual'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { PageContainer } from '../templates/layout'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import { BackdropSpinner } from '../templates/spinners'
import { treatments, availableTimes } from '../utils/bookings'
import { newAppSchema, handleFormErrors } from '../utils/formValidation'
import useStyles from '../styles/pages/NewAppointment'
import SuccessDialog from '../components/NewAppointment/SuccessDialog'
import {
  Grid,
  Switch,
  FormControlLabel,
  Collapse,
  MenuItem,
  Typography,
  Chip,
  ListSubheader
} from '@material-ui/core'

// if we don't have this, when you edit the datepicker through your keyboard, the app crashes
const DisableKeyboard = props => <TextF {...props} onChange={() => {}} />
const MAX_MESSAGE_LENGTH = 80

const NewAppointment = ({
  loading,
  newAppLoading,
  schedule,
  user,
  getDoctorSchedule,
  createAppointment,
  setAlert
}) => {
  // HOOKS
  const classes = useStyles()
  const [newAppSuccess, setNewAppSuccess] = useState(false)
  const [forSomeoneElse, setForSomeoneElse] = useState(false)
  const [chosenDate, setChosenDate] = useState(new Date())
  const [form, setForm] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    dateOfBirth: ''
  })

  const chosenTreatment = treatments.findIndex(({ label }) => label === form.treatment)

  // ====================================================================================

  // DATE CALCULATION MADNESS
  const availableSlots = availableTimes.map(
    time => new Date(chosenDate.toISOString().split('T')[0] + 'T' + time)
  )
  // console.log(availableSlots)

  const freeSlots = []
  let totalAvailable = []
  for (let item of availableSlots) {
    // this loop works fine
    const startMatches = schedule.some(date => {
      const itemTimestamp = new Date(item).getTime()

      const startTimestamp = new Date(date.startAt).getTime()
      const endTimestamp = new Date(date.endAt).getTime()
      const inTheMiddle = itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp

      return inTheMiddle
    })

    if (!startMatches) freeSlots.push(item)
  }
  // console.log(freeSlots)
  const freeSlotsToTimestamps = freeSlots.map(slot => ({
    startAt: new Date(slot).getTime(),
    endAt: new Date(slot).getTime() + 1799000
  }))
  // console.log(freeSlotsToTimestamps)
  totalAvailable = freeSlotsToTimestamps.filter(slot =>
    freeSlotsToTimestamps.some(
      item => item.endAt === slot.startAt + treatments[chosenTreatment].duration
    )
  )
  // console.log(totalAvailable)

  // ====================================================================================

  // LIFECYCLES
  useEffect(() => {
    getDoctorSchedule()
    // eslint-disable-next-line
  }, [])

  // ====================================================================================

  // EVENT HANDLERS
  const handleChange = e => {
    // if-check that prevents the app from crashing when you click category label
    if (e.target.value !== undefined) {
      // if you select the category label (invalid value), value is undefined
      setForm({ ...form, [e.target.name]: e.target.value })
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      // validation stuff, then making a request
      if (!user.isDoctor) {
        if (forSomeoneElse) {
          await newAppSchema.validate(form, { abortEarly: false })
          form.startAt && form.endAt
            ? createAppointment(form, setNewAppSuccess, setForm)
            : setAlert('Please choose a time slot', 'info')
        } else {
          form.startAt && form.endAt
            ? createAppointment(form, setNewAppSuccess, setForm)
            : setAlert('Please choose a time slot', 'info')
        }
      } else {
        await newAppSchema.validate(form, { abortEarly: false })
        form.startAt && form.endAt
          ? createAppointment(form, setNewAppSuccess, setForm)
          : setAlert('Please choose a time slot', 'info')
      }
    } catch (err) {
      handleFormErrors(err, formErrors, setFormErrors)
    }
  }

  const chooseTimeslot = timeslot => {
    const startAt = new Date(timeslot)
    const endAtTimestamp = new Date(
      new Date(startAt).getTime() + treatments[chosenTreatment].duration
    )
    const endAt = new Date(endAtTimestamp)
    // automatically set startAt and endAt on every timeslot choice
    setForm({ ...form, startAt, endAt })
  }

  const shouldDisableDate = currD => {
    // disable datepicker date if it's weekend or today
    const isWeekend = currD.getDay() === 0 || currD.getDay() === 6
    const isToday =
      new Date(currD).toLocaleDateString() === new Date().toLocaleDateString()

    return isWeekend || isToday
  }

  // ====================================================================================

  const renderCategoryTreatments = category => {
    const itemsToRender = treatments.filter(item => item.category === category)

    return itemsToRender.map(({ label }) => (
      <MenuItem key={label} value={label}>
        {label}
      </MenuItem>
    ))
  }

  // JSX
  return loading ? (
    <BackdropSpinner />
  ) : (
    <PageContainer>
      <form
        onSubmit={handleSubmit}
        noValidate // we have our own validation
        style={{ maxWidth: 1024, margin: '0 auto' }}
      >
        {!user.isDoctor && (
          <FormControlLabel
            style={{ marginBottom: forSomeoneElse ? 32 : 0 }}
            label="Appointment for someone else"
            control={
              <Switch
                checked={forSomeoneElse}
                onChange={e => setForSomeoneElse(e.target.checked)}
              />
            }
          />
        )}

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            {user.isDoctor ? (
              <TextF
                fullWidth
                name="fullName"
                onChange={handleChange}
                value={form.fullName}
                label="Full name"
                error={Boolean(formErrors.fullName)}
                helperText={formErrors.fullName || null}
              />
            ) : (
              <Collapse in={forSomeoneElse}>
                <TextF
                  fullWidth
                  name="fullName"
                  onChange={handleChange}
                  value={form.fullName}
                  label="Full name"
                  error={Boolean(formErrors.fullName)}
                  helperText={formErrors.fullName || null}
                />
              </Collapse>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {user.isDoctor ? (
              <TextF
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                name="dateOfBirth"
                onChange={handleChange}
                value={form.dateOfBirth}
                label="Date of birth"
                error={Boolean(formErrors.dateOfBirth)}
                helperText={formErrors.dateOfBirth || null}
              />
            ) : (
              <Collapse in={forSomeoneElse}>
                <TextF
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={form.dateOfBirth}
                  label="Date of birth"
                  error={Boolean(formErrors.dateOfBirth)}
                  helperText={formErrors.dateOfBirth || null}
                />
              </Collapse>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextF
              select
              fullWidth
              name="treatment"
              onChange={handleChange}
              value={form.treatment}
              label="Treatment"
            >
              <ListSubheader className={classes.subheader}>Cosmetic</ListSubheader>
              {renderCategoryTreatments('cosmetic')}
              <ListSubheader className={classes.subheader}>General</ListSubheader>
              {renderCategoryTreatments('general')}
              <ListSubheader className={classes.subheader}>Surgical</ListSubheader>
              {renderCategoryTreatments('surgical')}
            </TextF>
          </Grid>

          <Grid item xs={12} md={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                shouldDisableDate={shouldDisableDate}
                format="dd MMM yyyy"
                value={chosenDate}
                onChange={newDate => setChosenDate(newDate)}
                label="Desired date"
                disablePast
                TextFieldComponent={DisableKeyboard}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextF
              InputProps={{ style: { padding: 24 } }}
              inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
              fullWidth
              multiline
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              label="Message (optional)"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body1">
                {MAX_MESSAGE_LENGTH - form.message.length} characters left
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Available time slots</Typography>
            {/* if the chosen date is today, show text, otherwise show available times */}
            {chosenDate.toLocaleDateString() === new Date().toLocaleDateString() ? (
              <Typography variant="body1">Please choose a day</Typography>
            ) : (
              <>
                {totalAvailable.length > 0 ? (
                  totalAvailable.map(({ startAt }, index) => (
                    <Chip
                      key={index}
                      variant={
                        form.startAt &&
                        new Date(form.startAt).toLocaleString() ===
                          new Date(startAt).toLocaleString()
                          ? 'default'
                          : 'outlined'
                      }
                      color="primary"
                      label={format(new Date(startAt), 'HH:mm')}
                      onClick={() => chooseTimeslot(startAt)}
                      className={classes.chip}
                    />
                  ))
                ) : (
                  <Typography variant="body1">This day is fully booked</Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
          <SpinnerButton
            type="submit"
            loading={newAppLoading}
            color="secondary"
            variant="contained"
            size="large"
          >
            Make appointment
          </SpinnerButton>
        </div>
      </form>

      {/* confirmation dialog once the appointment is booked */}
      <SuccessDialog open={newAppSuccess} setOpen={setNewAppSuccess} />
    </PageContainer>
  )
}

const mapStateToProps = state => ({
  loading: state.visual.loading.getSchedule,
  newAppLoading: state.visual.loading.makeNewApp,
  schedule: state.appointments.schedule,
  user: state.auth.user
})

export default connect(mapStateToProps, {
  getDoctorSchedule,
  createAppointment,
  setAlert
})(NewAppointment)
