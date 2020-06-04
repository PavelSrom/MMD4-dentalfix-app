import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    chip: {
      margin: theme.spacing(1),
      cursor: 'pointer'
    },
    subheader: {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      fontSize: 18
    }
  }),
  { index: 1 }
)
