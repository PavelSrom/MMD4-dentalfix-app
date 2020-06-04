const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const config = require('config')
const path = require('path')
const app = express()

app.use(express.json())
app.use(helmet())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/reset', require('./routes/reset'))

mongoose
  .connect(config.get('mongoURI'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.log(err)
    console.log('Database not connected')
  })

// PRODUCTION ENVIRONMENT
app.use(express.static('client/build'))
app.get('*', (req, res) => {
  res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
