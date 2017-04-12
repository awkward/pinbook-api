const slack = require('slack')
const express = require('express')

const cors = require('cors')
const app = express()

const config = require('./config.js')
const crypto = require('./crypto.js')
const slackTokenMiddleware = require('./middleware/slacktoken.js')

app.use(cors())
app.use(slackTokenMiddleware)

// extract controller logic to separate well documented files

// route to redirect to slacks auth page
app.get('/auth/request', function(req, res){
  const AUTH_URI = `https://slack.com/oauth/authorize?&client_id=${config.CLIENT_ID}&scope=${config.SCOPE}&redirect_uri=${config.REDIRECT_URI}`
  res.redirect(AUTH_URI)
})

app.get('/', function(req, res) {
    res.send('noot noot 😼')
})

app.get('/auth', function(req, res) {
  // trade authorize code for access token
  slack.oauth.access({client_id: config.CLIENT_ID, client_secret: config.CLIENT_SECRET, code: req.query.code, redirect_uri: config.REDIRECT_URI}, (err, data) => {

    // early return if something has gone wrong
    if(err) {
      return res.status(406).send({
        success: false,
        message: err.toString(),
      })
    }

    res.send({
      success: true,
      token: crypto.encrypt(data.access_token),
    })

  })

})

app.get('/setup', function(req, res) {

  slack.channels.list({token: req.slackToken}, (err, channels) => {

    // early return if error
    if(err) {
      res.status(406).send({
        success: false,
        message: err.toString(),
      })
    }

    slack.users.list({token: req.slackToken}, (err, users) => {

      // early return if error
      if(err) {
        res.status(406).send({
          success: false,
          message: err.toString(),
        })
      }

      // tsall good.
      res.send({
        channels: channels.channels,
        users: users.members,
      })
    })

  })

})

// yeah.
app.get('/pins', function(req, res) {

  slack.pins.list({token: req.slackToken, channel: req.query.channel}, (err, data) => {
    // early return if error
    if(err) {
      res.status(406).send({
        success: false,
        message: err.toString(),
      })
    }

    // tsall good.
    res.send(data)
  })
});

// start node server
app.listen(config.PORT);
