import React from 'react'
import clsx from 'clsx'
import { makeStyles, TextField } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 24,
        border: `2px solid ${theme.palette.primary.main}` // blue border instead of default
      },
      [`& legend`]: {
        marginLeft: ({ size }) => (size === 'small' ? 8 : 12)
      }
    },
    inputProps: {
      padding: ({ size }) => `0 ${size === 'small' ? '9px' : '13px'}`
    },
    inputLabelProps: {
      padding: ({ size }) => `0 ${size === 'small' ? '12px' : '17px'}`
    },
    helperTextProps: {
      padding: ({ size }) => `0 ${size === 'small' ? '10px' : '14px'}`
    }
  }),
  { index: 1 }
)

export const TextF = ({
  children,
  size = 'medium',
  className,
  InputProps,
  InputLabelProps,
  ...rest
}) => {
  const classes = useStyles({ size })

  return (
    <TextField
      {...rest}
      variant="outlined"
      size={size}
      FormHelperTextProps={{ className: classes.helperTextProps }}
      InputLabelProps={{ ...InputLabelProps, className: classes.inputLabelProps }}
      InputProps={{ ...InputProps, className: classes.inputProps }}
      className={clsx(className, classes.textField)}
    >
      {children}
    </TextField>
  )
}
