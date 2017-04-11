const slack = require('slack')
const express = require('express')
const crypto = require('crypto')
const app = express()

require('dotenv').config()

const CONFIG = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  SCOPE: 'pins:read,reactions:read,channels:read,users:read',
  PORT: process.env.PORT,
  CRYPTO_PASS: process.env.CRYPTO_PASS,
}

const AUTH_URI = `https://slack.com/oauth/authorize?&client_id=${CONFIG.CLIENT_ID}&scope=${CONFIG.SCOPE}&redirect_uri=${CONFIG.REDIRECT_URI}`

const encrypt = function(data) {
  const cipher = crypto.createCipher('aes-256-ctr', CONFIG.CRYPTO_PASS);
  var crypted = cipher.update(data,'utf8','hex')
  crypted += cipher.final('hex')
  return crypted
}

const decrypt = function(data) {
  const cipher = crypto.createCipher('aes-256-ctr', CONFIG.CRYPTO_PASS);
  let dec = cipher.update(data,'hex','utf8')
  dec += cipher.final('utf8')
  return dec
}

// route to redirect to slacks auth page
app.get('/auth/request', function(req, res){
  res.redirect(AUTH_URI)
})

app.get('/', function(req, res) {
    res.send('noot noot 😼')
})

app.get('/auth', function(req, res) {
  // trade authorize code for access token
  slack.oauth.access({client_id: CONFIG.CLIENT_ID, client_secret: CONFIG.CLIENT_SECRET, code: req.query.code, redirect_uri: CONFIG.REDIRECT_URI}, (err, data) => {

    // early return if something has gone wrong
    if(err) {
      console.error('Got an error while authorizing user', err)

      return res.send({
        success: false,
        message: err.toString(),
      });
    }

    console.log('got sum stuffz: ', data);

    res.send({
      success: true,
      token: encrypt(data.access_token),
    })

  })

})

const tokenFromRequest = function(req) {
  return decrypt(req.headers.token);
}

app.get('/channels', function(req, res) {
  const token = tokenFromRequest(req)
  slack.channels.list({token}, (err, data) => {

    // early return if error
    if(err) {
      res.send({
        success: false,
        message: err.toString(),
      })
    }

    // tsall good.
    res.send(data)

  })
});

app.get('/users', function(req, res) {
  const token = tokenFromRequest(req)
  slack.users.list({token}, (err, data) => {

    // early return if error
    if(err) {
      res.send({
        success: false,
        message: err.toString(),
      })
    }

    // tsall good.
    res.send(data)
  })
})

app.get('/pins', function(req, res) {
  const token = tokenFromRequest(req)

  slack.pins.list({token, channel: 'C024FUS8M'}, (err, data) => {
    // early return if error
    if(err) {
      res.send({
        success: false,
        message: err.toString(),
      })
    }

    // tsall good.
    res.send(data)
  })
});

// start node server
app.listen(CONFIG.PORT);
