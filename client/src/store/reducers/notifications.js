import * as aTypes from '../types'

const initialState = {
  notifications: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case aTypes.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload
      }

    case aTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications]
      }

    case aTypes.DELETE_NOTIFICATION:
      const newNotifs = state.notifications.filter(notif => notif._id !== payload)

      return {
        ...state,
        notifications: newNotifs
      }

    case aTypes.RESET_REDUCERS:
      return initialState

    default:
      return state
  }
}
