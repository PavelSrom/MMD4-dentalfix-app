import * as aTypes from '../types'
import axios from 'axios'
import { showSpinner, hideSpinner, setAlert } from './visual'

export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get('/api/notifications')
    dispatch({ type: aTypes.GET_NOTIFICATIONS, payload: res.data })
  } catch ({ response }) {
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const deleteNotification = id => async dispatch => {
  dispatch(showSpinner('deleteNotif'))
  try {
    await axios.delete(`/api/notifications/${id}`)
    dispatch({ type: aTypes.DELETE_NOTIFICATION, payload: id })
    dispatch(hideSpinner('deleteNotif'))
  } catch ({ response }) {
    dispatch(hideSpinner('deleteNotif'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}
