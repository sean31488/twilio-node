const { client } = require('./modules/twilio')

const roomSid = process.env.ROOM_SID

// 取得room的所有tracks(影、音)
client.video.rooms(roomSid)
  .recordings
  .list({})
  .then(recordings => {
    console.log('list recordings success')

    // 定義layout
    let videoLayout = {
      main: {
        width: 840,
        height: 472,
        x_pos: 430,
        y_pos: 131,
        video_sources: ['*'],
        video_sources_excluded: ['hcp_*', 'share-screen_*'],
      },
      column: {
        width: 416,
        height: 234,
        x_pos: 10,
        y_pos: 131,
        max_columns: 1,
        max_rows: 1,
        reuse: 'show_newest',
        video_sources: ['hcp_*'],
      },
      row: {
        width: 416,
        height: 234,
        x_pos: 10,
        y_pos: 369,
        max_columns: 1,
        max_rows: 1,
        reuse: 'show_newest',
        video_sources: ['share-screen_*'],
      }
    }

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
