const Pusher = require('pusher')
const config = require('config')

module.exports = new Pusher({
  appId: config.get('pusherAppId'),
  key: config.get('pusherKey'),
  secret: config.get('pusherSecret'),
  cluster: 'eu',
  useTLS: true
})
