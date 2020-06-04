import React from 'react'
import { Typography } from '@material-ui/core'
import { PageContainer } from '../templates/layout'
import { Call, Mail, Location, Schedule } from '../templates/icons'
import useStyles from '../styles/pages/Contact'

const Contact = () => {
  const classes = useStyles()

  return (
    <PageContainer>
      <Typography variant="h4" className={classes.headline}>
        Your smile starts here!
      </Typography>

      <div className={classes.flex}>
        <div className={classes.info}>
          <Typography className={classes.description}>
            You deserve the best quality dentistry from a friendly and well prepared team.
            Therefore, DentalFix is equipped to serve you with convenience and excellent
            treatment. We look forward to seeing you!
          </Typography>

          {/* icons with information */}
          <div className={classes.row}>
            <Call className={classes.infoIcon} />
            <Typography className={classes.iconText}>
              <a
                style={{ textDecoration: 'none', color: 'inherit' }}
                href="tel:+400233280111"
              >
                +400 233 280 111
              </a>
            </Typography>
          </div>

          <div className={classes.row}>
            <Mail className={classes.infoIcon} />
            <Typography className={classes.iconText}>
              <a
                style={{ textDecoration: 'none', color: 'inherit' }}
                href="mailto:dentalfix@gmail.com"
              >
                dentalfix@gmail.com
              </a>
            </Typography>
          </div>

          <div className={classes.row}>
            <Location className={classes.infoIcon} />
            <Typography className={classes.iconText}>
              Street Bunis, nr. 4, Neamt County
            </Typography>
          </div>

          <div className={classes.row}>
            <Schedule className={classes.infoIcon} />
            <Typography className={classes.iconText}>
              Monday - Friday
              <br />
              9:00am - 8:00pm
            </Typography>
          </div>
        </div>

        <div className={classes.mapContainer}>
          <iframe
            title="DentalFix map"
            className={classes.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.427716828076!2d26.469670915801686!3d46.85495464758926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b5559be8b7b3ad%3A0xac5b27ffeaa8f0e4!2sStrada%20General%20Buni%C8%99%2C%20S%C4%83vine%C8%99ti%20617410%2C%20Romania!5e0!3m2!1sen!2sdk!4v1589098717262!5m2!1sen!2sdk"
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default Contact
