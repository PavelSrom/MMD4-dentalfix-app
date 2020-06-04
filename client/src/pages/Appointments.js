import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab, makeStyles } from '@material-ui/core'
import { PageContainer } from '../templates/layout'
import { AppointmentsSpinner } from '../templates/spinners'

import Upcoming from '../components/Appointments/Upcoming'
import Past from '../components/Appointments/Past'

const useStyles = makeStyles(
  theme => ({
    tab: {
      height: 64,
      [theme.breakpoints.down('sm')]: {
        height: 56
      },
      boxShadow: '0 4px 2px -2px gray'
    }
  }),
  { index: 1 }
)

const Appointments = ({ myApps, loading }) => {
  const classes = useStyles()
  const [chosenTab, setChosenTab] = useState(0)
  const upcoming = myApps.filter(app => new Date(app.startAt) > new Date())
  const past = myApps.filter(app => new Date(app.startAt) < new Date())

  const tabs = [
    {
      value: 0,
      label: 'Upcoming',
      component: <Upcoming appointments={upcoming} />
    },
    {
      value: 1,
      label: 'Past',
      component: <Past appointments={past} />
    }
  ]

  return (
    <>
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        TabIndicatorProps={{ style: { height: 4 } }}
        value={tabs[chosenTab].value}
        onChange={(_, newValue) => setChosenTab(newValue)}
        style={{ background: '#f2f2f2' }}
      >
        {tabs.map(({ value, label }) => (
          <Tab className={classes.tab} key={value} value={value} label={label} />
        ))}
      </Tabs>

      <PageContainer>
        {loading ? <AppointmentsSpinner /> : tabs[chosenTab].component}
      </PageContainer>
    </>
  )
}

const mapStateToProps = state => ({
  // listen for 'myApps' changes in Redux
  myApps: state.appointments.myApps,
  // listen for the loading state of these appointments
  loading: state.visual.loading.getMyApps
})

// connect this component to Redux
export default connect(mapStateToProps)(Appointments)
