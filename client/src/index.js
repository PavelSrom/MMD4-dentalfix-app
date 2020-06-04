import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

// Redux and MUI
import { Provider as ReduxProvider } from 'react-redux'
import store from './store'
import { ThemeProvider } from '@material-ui/core'
import theme from './utils/theme'

const app = (
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ReduxProvider>
)

render(app, document.getElementById('root'))
serviceWorker.register() // change to 'register' before deployment
