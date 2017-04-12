const slack = require('slack')

const index = (req, res) => {
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
}

module.exports = {
  index,
}
