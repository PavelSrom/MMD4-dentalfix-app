import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// importing reducers
import auth from './reducers/auth'
import appointments from './reducers/appointments'
import notifications from './reducers/notifications'
import visual from './reducers/visual'
import reset from './reducers/reset'

const rootReducer = combineReducers({
  auth,
  appointments,
  notifications,
  visual,
  reset
})

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
