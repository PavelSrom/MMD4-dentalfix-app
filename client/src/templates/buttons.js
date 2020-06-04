import React from 'react'
import { Button, makeStyles, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles(
  () => ({
    spinner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: ({ size }) => (size && size === 'small' ? -8 : -12),
      marginLeft: ({ size }) => (size && size === 'small' ? -8 : -12)
    }
  }),
  { index: 1 }
)

export const SpinnerButton = ({ children, loading, size, color, variant, ...rest }) => {
  const buttonStyle = {
    borderRadius: 30
  }
  if (variant === 'contained' && color === 'secondary') buttonStyle.color = '#fff'

  const classes = useStyles({ size })

  return (
    <Button
      {...rest}
      color={color}
      size={size}
      disabled={loading}
      variant={variant && variant}
      style={buttonStyle}
    >
      <span style={{ position: 'relative' }}>
        {loading && (
          <CircularProgress
            color={color}
            size={size && size === 'small' ? 16 : 24}
            className={classes.spinner}
          />
        )}
        {children}
      </span>
    </Button>
  )
}

export const RoundedButton = ({ style, children, ...rest }) => (
  <Button {...rest} style={{ ...style, borderRadius: 30 }}>
    {children}
  </Button>
)
