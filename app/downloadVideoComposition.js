const { client } = require('./modules/twilio')
const fs = require('fs')
const request = require('request')

const compositionSid = process.env.COMPOSITION_SID

// 下載影片
const uri = `https://video.twilio.com/v1/Compositions/${compositionSid}/Media`
client.request({ method: 'GET', uri })
  .then(response => {
    console.log('download video composition success', response)

    const file = fs.createWriteStream('myFile.mp4')
    const r = request(response.body.redirect_to)
    r.on('response', (res) => {
      res.pipe(file)
    })
  })
  .catch(err => {
    console.error('download video composition error', err)
  })
