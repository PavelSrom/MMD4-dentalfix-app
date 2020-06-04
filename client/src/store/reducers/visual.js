import * as aTypes from '../types'

const initialState = {
  alerts: [],
  loading: {
    register: false,
    login: false,
    getMyApps: false,
    getSchedule: false,
    makeNewApp: false,
    cancelApp: false,
    deleteNotif: false,
    pwResetRequest: false,
    pwResetConfirm: false,
    updateProfile: false,
    deleteProfile: false
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case aTypes.LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [payload]: true
        }
      }

    case aTypes.STOP_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [payload]: false
        }
      }

    case aTypes.SET_ALERT:
      return {
        ...state,
        alerts: [payload] // always just one item in the array to prevent snackbar overlapping
      }

    case aTypes.REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== payload)
      }

    case aTypes.RESET_REDUCERS:
      return initialState

    default:
      return state
  }
}
