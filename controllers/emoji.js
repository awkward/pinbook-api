const slack = require('slack')

const index = (req, res) => {
  slack.emoji.list({token: req.slackToken}, (err, data) => {
    if(err) return res.status(500).send(err)
    res.status(200).send(data);
  })

}

module.exports = {
  index,
}
