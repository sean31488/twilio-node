const { client } = require('./modules/twilio')

const roomSid = process.env.ROOM_SID

// 取得room的所有tracks(影、音)
client.video.rooms(roomSid)
  .recordings
  .list({})
  .then(recordings => {
    console.log('list recordings success')

    const videoRecordings = []
    recordings.forEach(recording => {
      if (recording.type === 'video') {
        videoRecordings.push(recording.sid)
      }
    })

    // 製作影片
    client.video.compositions.create({
      roomSid,
      audioSources: '*',
      videoLayout: {
        single: {
          video_sources: videoRecordings
        }
      },
      trim: true,
      format: 'mp4',
      statusCallback: null
    }).then(composition => {
      console.log('video composition success')

      // 取得影片基本資料
      client.video.compositions(composition.sid)
        .fetch()
        .then(fetchedComposition => {
          console.log('fetch video composition success')
        })

    }).catch(err => {
      console.error('video composition error', err)
    })
  })
  .catch(err => {
    console.error('list recordings error', err)
  })
