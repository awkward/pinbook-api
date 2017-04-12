const crypto = require('../crypto.js')

const slackTokenMiddleware = (req, res, next) => {
  if(req.headers.token) {
    req.slackToken = crypto.decrypt(req.headers.token)
  }

  next()
}

module.exports = slackTokenMiddleware
