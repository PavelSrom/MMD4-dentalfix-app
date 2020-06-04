import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerUser } from '../store/actions/auth'
import { handleFormErrors, registerSchema } from '../utils/formValidation'
import {
  Typography,
  Grid,
  Container,
  IconButton,
  InputAdornment
} from '@material-ui/core'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import logo from '../assets/logo_192x192.png'
import useStyles from '../styles/pages/Register'
import { Visibility, VisibilityOff } from '../templates/icons'

const formState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  dateOfBirth: ''
}

const Register = ({ loading, isAuthenticated, registerUser }) => {
  const classes = useStyles()
  const [pwShown, setPwShown] = useState(false)
  const [form, setForm] = useState(formState)
  const [formErrors, setFormErrors] = useState(formState)

  const calculateAge = () => {
    const enteredDob = new Date(form.dateOfBirth).toLocaleDateString()
    const [month, day, year] = enteredDob.split('/')
    const dobIn18Years = new Date(`${month}/${day}/${Number(year) + 18}`)

    if (form.dateOfBirth) return new Date(dobIn18Years) < new Date()
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault() // prevent page from refreshing

    try {
      // validate form
      await registerSchema.validate(form, { abortEarly: false })
      // calculate the user's age
      const isAdult = calculateAge()

      if (!isAdult) {
        // they're not an adult => set error text for the 'dateOfBirth' field
        setFormErrors({ ...formErrors, dateOfBirth: 'you must be over 18' })
      } else {
        // everything OK, user can be registered
        registerUser(form)
      }
    } catch (err) {
      // make invalid form fields red and add an error text
      handleFormErrors(err, formErrors, setFormErrors)
    }
  }

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
            Create an account
          </Typography>

          {/* form fields */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ maxWidth: 768, margin: '0 auto' }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <TextF
                  fullWidth
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  label="First name"
                  error={Boolean(formErrors.firstName)}
                  helperText={formErrors.firstName || null}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextF
                  fullWidth
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  label="Last name"
                  error={Boolean(formErrors.lastName)}
                  helperText={formErrors.lastName || null}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextF
                  type="email"
                  fullWidth
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  label="Email"
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email || null}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextF
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextF
                  fullWidth
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  label="Phone number"
                  error={Boolean(formErrors.phone)}
                  helperText={formErrors.phone || null}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextF
                  type="date"
                  fullWidth
                  name="dateOfBirth"
                  placeholder="mm/dd/yyyy"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  label="Date of birth"
                  error={Boolean(formErrors.dateOfBirth)}
                  helperText={formErrors.dateOfBirth || null}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>

            <SpinnerButton
              loading={loading}
              className={classes.submitBtn}
              type="submit"
              color="primary"
              variant="contained"
              size="large"
            >
              Sign up
            </SpinnerButton>
          </form>

          <Typography variant="body1" style={{ textAlign: 'center', marginTop: 8 }}>
            {'Already have an account? '}
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
  loading: state.visual.loading.register,
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { registerUser })(Register)
