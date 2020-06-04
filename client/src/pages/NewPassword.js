import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { confirmNewPassword } from '../store/actions/reset'
import { Typography, Container } from '@material-ui/core'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { handleFormErrors, newPwSchema } from '../utils/formValidation'
import logo from '../assets/logo_192x192.png'
import useStyles from '../styles/pages/NewPassword'

const formState = { newPassword: '', confirmNewPassword: '' }

const NewPassword = ({ loading, confirmNewPassword }) => {
  const params = useParams()
  const history = useHistory()
  const classes = useStyles()
  const [form, setForm] = useState(formState)
  const [formErrors, setFormErrors] = useState(formState)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await newPwSchema.validate(form, { abortEarly: false })

      if (form.newPassword === form.confirmNewPassword) {
        confirmNewPassword(form.newPassword, params.id, history)
      } else {
        setFormErrors({
          newPassword: 'passwords do not match',
          confirmNewPassword: 'passwords do not match'
        })
      }
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
            width={192}
            height={192}
            src={logo}
            alt=""
            className={classes.logo}
          />
          <Typography variant="h5" className={classes.headline}>
            Create new password
          </Typography>

          {/* form fields */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ maxWidth: 480, margin: '0 auto' }}
          >
            <TextF
              className={classes.textField}
              type="password"
              name="newPassword"
              fullWidth
              value={form.newPassword}
              onChange={handleChange}
              label="New password"
              error={Boolean(formErrors.newPassword)}
              helperText={formErrors.newPassword}
            />

            <TextF
              className={classes.textField}
              type="password"
              name="confirmNewPassword"
              fullWidth
              value={form.confirmNewPassword}
              onChange={handleChange}
              label="Confirm new password"
              error={Boolean(formErrors.confirmNewPassword)}
              helperText={formErrors.confirmNewPassword}
            />

            <SpinnerButton
              loading={loading}
              className={classes.submitBtn}
              type="submit"
              color="primary"
              variant="contained"
              size="large"
            >
              Submit new password
            </SpinnerButton>
          </form>
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  loading: state.visual.loading.pwResetConfirm
})

export default connect(mapStateToProps, { confirmNewPassword })(NewPassword)
