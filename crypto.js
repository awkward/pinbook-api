const crypto = require('crypto')
const config = require('./config.js')

const encrypt = data => {
  const cipher = crypto.createCipher('aes-256-ctr', config.CRYPTO_PASS)
  let crypted = cipher.update(data,'utf8','hex')
  crypted += cipher.final('hex')
  return crypted
}

const decrypt = data => {
  const cipher = crypto.createCipher('aes-256-ctr', config.CRYPTO_PASS)
  let dec = cipher.update(data,'hex','utf8')
  dec += cipher.final('utf8')
  return dec
}

module.exports = {
  encrypt,
  decrypt,
}
