import * as aTypes from '../types'

const initialState = {
  requestSuccessful: false
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case aTypes.PW_REQUEST_SUCCESS:
      return {
        ...state,
        requestSuccessful: true
      }

    case aTypes.RESET_REDUCERS:
      return initialState

    default:
      return state
  }
}
