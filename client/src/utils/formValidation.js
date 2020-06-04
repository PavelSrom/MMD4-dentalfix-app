import * as Yup from 'yup'

export const handleFormErrors = (err, errorState, setErrorState) => {
  // Please note that form and 'errorState' should have the EXACT SAME structure!
  const errors = []
  err.inner.forEach(({ path, message }) => {
    errors.push({ name: path, message })
  })

  const newErrors = { ...errorState }
  for (let key of Object.keys(errorState)) {
    if (errors.map(({ name }) => name).includes(key)) {
      const thatErr = errors.find(({ name }) => name === key)
      newErrors[key] = thatErr.message
    }
  }

  setErrorState(newErrors)
}

// ======================================================================================

// VALIDATION SCHEMAS

export const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('required field'),
  lastName: Yup.string().required('required field'),
  email: Yup.string().email('must be a valid email').required('required field'),
  password: Yup.string().min(6, 'at least 6 characters').required('required field'),
  phone: Yup.string().min(8, 'at least 8 characters').required('required field'),
  dateOfBirth: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'must be a valid date'
  })
})

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('must be a valid email').required('required field'),
  password: Yup.string().min(6, 'at least 6 characters').required('required field')
})

export const forgotPwSchema = Yup.object().shape({
  email: Yup.string().email('must be a valid email').required('required field')
})

export const newAppSchema = Yup.object().shape({
  fullName: Yup.string('required field').required('required field'),
  dateOfBirth: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'must be a valid date'
  })
})

export const newPwSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, 'at least 6 characters').required('required field'),
  confirmNewPassword: Yup.string()
    .min(6, 'at least 6 characters')
    .required('required field')
})
