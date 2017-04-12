const slack = require('slack')
const config = require('../config.js')
const crypto = require('../crypto.js')

const auth = (req, res) => {

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
}

const request = (req, res) => {
  const AUTH_URI = `https://slack.com/oauth/authorize?&client_id=${config.CLIENT_ID}&scope=${config.SCOPE}&redirect_uri=${config.REDIRECT_URI}`
  res.redirect(AUTH_URI)
}

module.exports = {
  auth,
  request,
}
