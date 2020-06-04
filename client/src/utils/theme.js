import { createMuiTheme } from '@material-ui/core'

export default createMuiTheme({
  palette: {
    primary: { main: '#52969F' },
    secondary: { main: '#E28079' },
    text: { primary: '#3C3C3C' }
  },
  typography: {
    fontFamily: ['Raleway', 'sans-serif'].join(', ')
  },
  // disable input background on form autocompletion
  overrides: {
    MuiInputBase: {
      input: {
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, #fff'
        }
      }
    }
  }
})
