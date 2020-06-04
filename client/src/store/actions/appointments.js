import * as aTypes from '../types'
import axios from 'axios'
import { setAlert, showSpinner, hideSpinner } from './visual'
import { add } from 'date-fns'
import { treatments } from '../../utils/bookings'

export const initialFormState = {
  fullName: '',
  dateOfBirth: '',
  treatment: treatments[0].label,
  startAt: '',
  endAt: '',
  message: ''
}

export const getDoctorSchedule = () => async dispatch => {
  dispatch(showSpinner('getSchedule'))
  try {
    const res = await axios.get('/api/appointments')
    dispatch({ type: aTypes.GET_SCHEDULE, payload: res.data })
    dispatch(hideSpinner('getSchedule'))
  } catch ({ response }) {
    dispatch(hideSpinner('getSchedule'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const getMyAppointments = () => async (dispatch, getState) => {
  dispatch(showSpinner('getMyApps'))
  try {
    const res = await axios.get('/api/appointments/me')
    dispatch({ type: aTypes.GET_MY_APPOINTMENTS, payload: res.data })
    dispatch(hideSpinner('getMyApps'))

    // remind the patient they have to book a checkup every 6 months
    const user = getState().auth.user
    const myApps = getState().appointments.myApps
    if (!user.isDoctor) {
      const hasCheckupScheduled = myApps
        .filter(({ startAt }) => new Date(startAt) > new Date())
        .find(({ treatment }) => treatment === 'Diagnosis')
      if (hasCheckupScheduled) return // everything OK

      const lastCheckup = myApps
        .filter(({ startAt }) => new Date(startAt) < new Date()) // only past appointments
        .sort((a, b) => new Date(b.startAt) - new Date(a.startAt)) // sort from most recent
        .find(({ treatment }) => treatment === 'Diagnosis')
      if (!lastCheckup)
        return dispatch(setAlert('Please make a checkup appointment', 'warning'))

      const checkup6MonthsAgo = add(lastCheckup.startAt, { months: 6 })
      if (checkup6MonthsAgo > new Date())
        return dispatch(setAlert('Please make a checkup appointment', 'warning'))
    }
  } catch ({ response }) {
    dispatch(hideSpinner('getMyApps'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const createAppointment = (formData, setAppSuccess, setForm) => async dispatch => {
  dispatch(showSpinner('makeNewApp'))
  try {
    const res = await axios.post('/api/appointments', formData)
    dispatch({ type: aTypes.MAKE_APPOINTMENT, payload: res.data })
    dispatch(hideSpinner('makeNewApp'))
    setAppSuccess(true) // show success dialog in NewAppointment.js
    setForm(initialFormState) // reset form
  } catch ({ response }) {
    dispatch(hideSpinner('makeNewApp'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const deleteAppointment = id => async dispatch => {
  dispatch(showSpinner('cancelApp')) // show a spinner
  try {
    await axios.delete(`/api/appointments/${id}`) // make request
    // send the deleted appointment's ID to Redux as a payload
    // so that it can be removed from the store
    dispatch({ type: aTypes.DELETE_APPOINTMENT, payload: id })
    dispatch(hideSpinner('cancelApp')) // hide the spinner
    // show a success snackbar in the bottom center of the screen
    dispatch(setAlert('Appointment canceled', 'success'))
  } catch ({ response }) {
    // if anything goes wrong, hide the spinner
    dispatch(hideSpinner('cancelApp'))
    // and show an error snackbar on the screen
    dispatch(setAlert(response.data.message, 'error'))
  }
}
