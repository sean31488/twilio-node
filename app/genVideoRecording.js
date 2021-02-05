const { client } = require('./modules/twilio')

const roomSid = process.env.ROOM_SID

// 取得room的所有tracks(影、音)
client.video.rooms(roomSid)
  .recordings
  .list({})
  .then(recordings => {
    console.log('list recordings success')

    // 分離人像及分享螢幕視訊軌
    let hasShareScreen = false
    let avatarRecordings = []
    recordings.forEach(recording => {
      if (recording.type === 'video') {
        // share screen
        if (recording.trackName.startsWith('share-screen')) {
          hasShareScreen = true
        } else {
          avatarRecordings.push(recording.sid)
        }
      }
    })

    // 定義layout
    let videoLayout = {}

    // 有share screen
    if (hasShareScreen) {
      videoLayout = {
        main: {
          width: 960,
          height: 540,
          x_pos: 308,
          y_pos: 90,
          video_sources: ['share-screen_*'],
        },
        column: {
          width: 284,
          height: 540,
          x_pos: 12,
          y_pos: 90,
          max_columns: 1,
          reuse: 'show_newest',
          video_sources: avatarRecordings // 僅有人像視訊軌
        }
      }
    } else { // 無share screen
      videoLayout = {
        grid: {
          max_columns: 2,
          max_rows: 1,
          x_pos: 12,
          y_pos: 180,
          width: 1256,
          height: 360,
          video_sources: avatarRecordings
        }
      }
    }
    // 定義layout結束

    // 製作影片
    client.video.compositions.create({
      roomSid: roomSid,
      resolution: '1280x720',
      videoLayout: videoLayout,
      audioSources: '*',
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
