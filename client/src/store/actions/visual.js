import * as aTypes from '../types'
import { v4 } from 'uuid'

export const showSpinner = what => dispatch =>
  dispatch({ type: aTypes.LOADING, payload: what })
export const hideSpinner = what => dispatch =>
  dispatch({ type: aTypes.STOP_LOADING, payload: what })

export const setAlert = (message, type) => dispatch => {
  const id = v4()
  dispatch({
    type: aTypes.SET_ALERT,
    payload: {
      message: Array.isArray(message) ? message[0].msg : message,
      type,
      id
    }
  })

  setTimeout(() => dispatch({ type: aTypes.REMOVE_ALERT, payload: id }), 5000)
}
