const { client } = require('./modules/twilio')

const roomSid = process.env.ROOM_SID

// 取得room的所有tracks(影、音)
client.video.rooms(roomSid)
  .recordings
  .list({})
  .then(recordings => {
    console.log('list recordings success')

    // 排序，使用者影像不分順序，先進會議先顯示，share screen總是在最後
    let videoRecordings = []
    let shareScreenRecordings = []
    recordings.forEach(recording => {
      if (recording.type === 'video') {
        // share screen
        if (recording.trackName.startsWith('share-screen')) {
          shareScreenRecordings.push(recording.sid)
        } else {
          videoRecordings.push(recording.sid)
        }
      }
    })

    if (shareScreenRecordings.length > 0) {
      videoRecordings = videoRecordings.concat(shareScreenRecordings)
    }
    // 排序結束

    // 定義layout
    let videoLayout = {}

    // 有share screen
    if (shareScreenRecordings.length > 0) {
      videoLayout = {
        grid: {
          max_columns: 2,
          max_rows: 2,
          x_pos: 12,
          y_pos: 12,
          video_sources: videoRecordings
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
          video_sources: videoRecordings
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
