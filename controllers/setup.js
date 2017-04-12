const slack = require('slack')

const setup = (req, res) => {
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
}

module.exports = {
  setup,
}
