import * as aTypes from '../types'

const initialState = {
  isAuthenticated: null,
  user: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case aTypes.GET_USER_PROFILE:
      return {
        ...state,
        isAuthenticated: true,
        user: payload
      }

    case aTypes.AUTH_SUCCESS:
      localStorage.setItem('mmd4_token', payload.token)
      return state

    case aTypes.AUTH_FAIL:
      localStorage.removeItem('mmd4_token')
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }

    case aTypes.LOGOUT:
      localStorage.removeItem('mmd4_token')
      return initialState

    case aTypes.RESET_REDUCERS:
      return initialState

    default:
      return state
  }
}
