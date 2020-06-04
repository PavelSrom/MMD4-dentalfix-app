import * as aTypes from '../types'

const initialState = {
  schedule: [],
  myApps: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case aTypes.GET_SCHEDULE:
      return {
        ...state,
        schedule: payload
      }

    case aTypes.GET_MY_APPOINTMENTS:
      return {
        ...state,
        myApps: payload
      }

    case aTypes.MAKE_APPOINTMENT:
      return {
        ...state,
        schedule: [payload, ...state.schedule],
        myApps: [payload, ...state.myApps].sort(
          (a, b) => new Date(a.startAt) - new Date(b.startAt)
        )
      }

    case aTypes.DELETE_APPOINTMENT:
      return {
        ...state,
        schedule: state.schedule.filter(({ _id }) => _id !== payload),
        myApps: state.myApps.filter(({ _id }) => _id !== payload)
      }

    case aTypes.RESET_REDUCERS:
      return initialState

    default:
      return state
  }
}
