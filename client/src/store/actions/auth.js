import * as aTypes from '../types'
import axios from 'axios'
import pusher from '../../utils/pusher'
import setAxiosToken from '../../utils/setAxiosToken'
import { showSpinner, hideSpinner, setAlert } from './visual'

export const autoLoginUser = () => async dispatch => {
  if (localStorage.mmd4_token) setAxiosToken(localStorage.mmd4_token)
  try {
    const res = await axios.get('/api/auth')
    dispatch({ type: aTypes.GET_USER_PROFILE, payload: res.data })
    dispatch(setAlert('Logged in successfully', 'success'))

    // once logged in, start listening for new notifications
    const channel = pusher.subscribe(`user_${res.data._id}`)
    channel.bind('notification', newNotification => {
      dispatch({ type: aTypes.ADD_NOTIFICATION, payload: newNotification })
    })
  } catch ({ response }) {
    dispatch({ type: aTypes.AUTH_FAIL })
    dispatch(setAlert('Automatic login failed, please log in', 'warning'))
  }
}

export const registerUser = formData => async dispatch => {
  dispatch(showSpinner('register'))
  try {
    const res = await axios.post('/api/auth/register', formData)
    dispatch({ type: aTypes.AUTH_SUCCESS, payload: res.data })
    dispatch(autoLoginUser())
    dispatch(hideSpinner('register'))
  } catch ({ response }) {
    dispatch({ type: aTypes.AUTH_FAIL })
    dispatch(hideSpinner('register'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const loginUser = formData => async dispatch => {
  dispatch(showSpinner('login'))
  try {
    const res = await axios.post('/api/auth/login', formData)
    dispatch({ type: aTypes.AUTH_SUCCESS, payload: res.data })
    dispatch(autoLoginUser())
    dispatch(hideSpinner('login'))
  } catch ({ response }) {
    dispatch({ type: aTypes.AUTH_FAIL })
    dispatch(hideSpinner('login'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const updateUserAccount = formData => async dispatch => {
  dispatch(showSpinner('updateProfile'))
  try {
    const res = await axios.put('/api/auth', formData)
    dispatch({ type: aTypes.GET_USER_PROFILE, payload: res.data })
    dispatch(hideSpinner('updateProfile'))
    dispatch(setAlert('Profile updated', 'success'))
  } catch ({ response }) {
    dispatch(hideSpinner('updateProfile'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const deleteUserAccount = history => async dispatch => {
  dispatch(showSpinner('deleteProfile'))
  try {
    await axios.delete('/api/auth')
    dispatch(hideSpinner('deleteProfile'))
    dispatch({ type: aTypes.RESET_REDUCERS })
    history.push('/')
    dispatch(setAlert('Account deleted', 'success'))
  } catch ({ response }) {
    dispatch(hideSpinner('deleteProfile'))
    dispatch(setAlert(response.data.message, 'error'))
  }
}

export const logoutUser = () => dispatch => {
  dispatch({ type: aTypes.LOGOUT })
  dispatch({ type: aTypes.RESET_REDUCERS })
}
