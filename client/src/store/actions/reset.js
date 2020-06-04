import * as aTypes from '../types'
import axios from 'axios'
import { setAlert, showSpinner, hideSpinner } from './visual'

export const requestPasswordReset = email => async dispatch => {
  dispatch(showSpinner('pwResetRequest'))
  try {
    const res = await axios.post('/api/reset/requested', { email })
    dispatch({ type: aTypes.PW_REQUEST_SUCCESS })
    dispatch(hideSpinner('pwResetRequest'))
    dispatch(setAlert(res.data.message, 'success'))
  } catch ({ response }) {
    dispatch(hideSpinner('pwResetRequest'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const confirmNewPassword = (newPassword, token, history) => async dispatch => {
  dispatch(showSpinner('pwResetConfirm'))
  try {
    const res = await axios.post('/api/reset/confirm', { newPassword, token })
    dispatch(hideSpinner('pwResetConfirm'))
    history.push('/login')
    dispatch(setAlert(res.data.message, 'success'))
  } catch ({ response }) {
    dispatch(hideSpinner('pwResetConfirm'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}
