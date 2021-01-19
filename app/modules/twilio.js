const Twilio = require('twilio')

const apiKeySid = process.env.API_KEY_SID
const apiKeySecret = process.env.API_KEY_SECRET
const accountSid = process.env.ACCOUNT_SID

module.exports = {
  client: new Twilio(apiKeySid, apiKeySecret, { accountSid })
}
