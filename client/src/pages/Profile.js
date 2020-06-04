import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUserAccount, deleteUserAccount } from '../store/actions/auth'
import { Paper, Typography, Avatar, Divider, Grid, MenuItem } from '@material-ui/core'
import { PageContainer } from '../templates/layout'
import { TextF } from '../templates/inputs'
import { SpinnerButton } from '../templates/buttons'
import useStyles from '../styles/pages/Profile'
import { format, differenceInYears } from 'date-fns'

const Profile = ({
  user: { fullName, email, phone, dateOfBirth, language, isDoctor },
  updateUserAccount,
  deleteUserAccount,
  updateLoading,
  deleteLoading
}) => {
  const classes = useStyles()
  const history = useHistory()
  const [form, setForm] = useState({
    phone,
    language
  })
  const [formErrors, setFormErrors] = useState({
    phone: ''
  })

  const age = differenceInYears(new Date(), new Date(dateOfBirth))
  const [firstName, lastName] = fullName.split(' ')
  const initials = fullName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()

  const languages = [
    {
      label: 'English',
      value: 'en'
    },
    {
      label: 'Romanian',
      value: 'ro'
    }
  ]

  // ====================================================================================
  // EVENT HANDLERS

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ phone: '' })
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.phone) {
      setFormErrors({ phone: 'required field' })
    } else if (form.phone.length < 8) {
      setFormErrors({ phone: 'at least 8 characters' })
    } else {
      updateUserAccount(form)
    }
  }

  const handleAccountDeletion = () => {
    const isSure = window.confirm('Are you sure? This action is irreversible!')

    return isSure ? deleteUserAccount(history) : null
  }

  // ====================================================================================
  // JSX

  return (
    <PageContainer>
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <div className={classes.avatarBox}>
            <Avatar className={classes.avatar}>{initials}</Avatar>
          </div>
          <div className={classes.basicInfo}>
            <Typography variant="body1" className={classes.basicInfoText}>
              <span className={classes.bolder}>First name: </span>
              {firstName}
            </Typography>
            <Typography variant="body1" className={classes.basicInfoText}>
              <span className={classes.bolder}>Last name: </span>
              {lastName}
            </Typography>
            <Typography variant="body1" className={classes.basicInfoText}>
              <span className={classes.bolder}>Age: </span>
              {age}
            </Typography>
          </div>
        </div>
        <Divider className={classes.divider} />

        {/* input fields */}
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <TextF fullWidth disabled value={email} label="Email" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextF
                fullWidth
                disabled
                value={format(new Date(dateOfBirth), 'MMM d y')}
                label="Date of birth"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextF
                name="phone"
                onChange={handleChange}
                fullWidth
                value={form.phone}
                label="Phone"
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone || null}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextF
                select
                name="language"
                onChange={handleChange}
                fullWidth
                value={form.language}
                label="Language"
              >
                {languages.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextF>
            </Grid>
          </Grid>

          {/* CTA buttons */}
          <div
            className={classes.actionButtons}
            style={{ justifyContent: isDoctor ? 'flex-end' : 'space-between' }}
          >
            {!isDoctor && (
              <SpinnerButton
                loading={deleteLoading}
                color="primary"
                size="large"
                onClick={handleAccountDeletion}
                className={classes.deleteProfileBtn}
              >
                Delete profile
              </SpinnerButton>
            )}
            <SpinnerButton
              type="submit"
              loading={updateLoading}
              variant="contained"
              color="secondary"
              size="large"
            >
              Save changes
            </SpinnerButton>
          </div>
        </form>
      </Paper>
    </PageContainer>
  )
}

const mapStateToProps = state => ({
  user: state.auth.user,
  updateLoading: state.visual.loading.updateProfile,
  deleteLoading: state.visual.loading.deleteProfile
})

export default connect(mapStateToProps, { updateUserAccount, deleteUserAccount })(Profile)
