import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { requestPasswordReset } from '../store/actions/reset'
import { Typography, Container } from '@material-ui/core'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import logo from '../assets/logo_192x192.png'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { forgotPwSchema, handleFormErrors } from '../utils/formValidation'
import useStyles from '../styles/pages/ResetPassword'

const ResetPassword = ({ loading, success, requestPasswordReset }) => {
  const classes = useStyles()
  const [form, setForm] = useState({ email: '' })
  const [formErrors, setFormErrors] = useState({ email: '' })

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await forgotPwSchema.validate(form, { abortEarly: false })
      requestPasswordReset(form.email)
    } catch (err) {
      handleFormErrors(err, formErrors, setFormErrors)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.banner} />

      <div className={classes.formContainer}>
        <Container maxWidth="sm">
          <LazyLoadImage
            className={classes.logo}
            width={192}
            height={192}
            src={logo}
            alt=""
          />
          <Typography variant="h5" className={classes.headline}>
            Request password reset
          </Typography>

          {/* form fields */}
          {success ? (
            <>
              <Typography variant="body1">
                You have successfully requested a password reset. A reset link has been
                sent to {form.email}
              </Typography>
              <br />
              <Typography variant="body1">
                Please check your spam folder - it is likely that the email may be in
                there
              </Typography>
            </>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ maxWidth: 480, margin: '0 auto' }}
            >
              <TextF
                className={classes.textField}
                name="email"
                type="email"
                fullWidth
                value={form.email}
                onChange={e => setForm({ email: e.target.value })}
                label="Email"
                error={Boolean(formErrors.email)}
                helperText={formErrors.email || null}
              />

              <SpinnerButton
                loading={loading}
                className={classes.submitBtn}
                type="submit"
                color="primary"
                variant="contained"
                size="large"
              >
                Request reset link
              </SpinnerButton>
            </form>
          )}

          <Typography variant="body1" style={{ textAlign: 'center', marginTop: 20 }}>
            {'Have an account? '}
            <span>
              <Typography
                className={classes.linkRedirect}
                variant="body1"
                component={Link}
                to="/login"
              >
                Sign in
              </Typography>
            </span>
          </Typography>
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  loading: state.visual.loading.pwResetRequest,
  success: state.reset.requestSuccessful
})

export default connect(mapStateToProps, { requestPasswordReset })(ResetPassword)
