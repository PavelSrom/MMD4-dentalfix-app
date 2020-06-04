const sgMail = require('@sendgrid/mail')
const config = require('config')

sgMail.setApiKey(config.get('SGApiKey'))

module.exports = sgMail
