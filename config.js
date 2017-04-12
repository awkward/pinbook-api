require('dotenv').config()

module.exports = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  SCOPE: 'pins:read,reactions:read,channels:read,users:read',
  PORT: process.env.PORT,
  CRYPTO_PASS: process.env.CRYPTO_PASS,
}
