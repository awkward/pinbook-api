const express = require('express')
const cors = require('cors')

const config = require('./config.js')
const crypto = require('./crypto.js')
const slackTokenMiddleware = require('./middleware/slacktoken.js')

const defaultController = require('./controllers/default.js')
const authController = require('./controllers/auth.js')
const setupController = require('./controllers/setup.js')
const pinsController = require('./controllers/pins.js')

// setup app and configure middleware
const app = express()
app.use(cors())
app.use(slackTokenMiddleware)

// define routes and controllers
app.get('/', defaultController.home)
app.get('/auth/request', authController.request)
app.get('/auth', authController.auth)
app.get('/setup', setupController.setup)
app.get('/pins', pinsController.index)

// start express server
app.listen(config.PORT)
