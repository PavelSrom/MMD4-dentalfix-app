import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { loginUser } from '../store/actions/auth'
import { Typography, Container, IconButton, InputAdornment } from '@material-ui/core'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import logo from '../assets/logo_192x192.png'
import useStyles from '../styles/pages/Login'
import { Visibility, VisibilityOff } from '../templates/icons'
import { handleFormErrors, loginSchema } from '../utils/formValidation'

const formState = {
  email: '',
  password: ''
}

const Login = ({ loading, isAuthenticated, loginUser }) => {
  const classes = useStyles()
  const [pwShown, setPwShown] = useState(false)
  const [form, setForm] = useState(formState)
  const [formErrors, setFormErrors] = useState(formState)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await loginSchema.validate(form, { abortEarly: false })
      loginUser(form)
    } catch (err) {
      handleFormErrors(err, formErrors, setFormErrors)
    }
  }

  // redirect if logged in
  if (isAuthenticated) return <Redirect to="/appointments" />

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
            Sign in to your account
          </Typography>

          {/* form fields */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ maxWidth: 480, margin: '0 auto' }}
          >
            <TextF
              className={classes.textField}
              type="email"
              fullWidth
              name="email"
              value={form.email}
              onChange={handleChange}
              label="Email"
              error={Boolean(formErrors.email)}
              helperText={formErrors.email || null}
            />

            <TextF
              className={classes.textField}
              type={pwShown ? 'text' : 'password'}
              fullWidth
              name="password"
              value={form.password}
              onChange={handleChange}
              label="Password"
              error={Boolean(formErrors.password)}
              helperText={formErrors.password || null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setPwShown(!pwShown)}>
                      {pwShown ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <SpinnerButton
              loading={loading}
              className={classes.submitBtn}
              type="submit"
              color="primary"
              variant="contained"
              size="large"
            >
              Sign in
            </SpinnerButton>
          </form>

          <Typography variant="body1" style={{ textAlign: 'center', marginTop: 16 }}>
            <span>
              <Typography
                className={classes.forgotPassword}
                component={Link}
                to="/reset"
                variant="body1"
              >
                Forgot password?
              </Typography>
            </span>
          </Typography>

          <Typography variant="body1" style={{ textAlign: 'center', marginTop: 40 }}>
            {"Don't have an account? "}
            <span>
              <Typography
                className={classes.linkRedirect}
                variant="body1"
                component={Link}
                to="/register"
              >
                Sign up now
              </Typography>
            </span>
          </Typography>
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  loading: state.visual.loading.login,
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { loginUser })(Login)
