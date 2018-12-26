export class PlaybackController {

  _client = null
  _state = null

  constructor(client, state) {
    this._client = client
    this._state = state
  }

  get state() {
    return this._state
  }

  get client() {
    return this._client
  }

  tick() {
    console.debug(`tick`)
    let self = this
    let progress = setInterval( () => {
    if (self.state.playingState != "playing" || (self.state.timeLength > 0 && self.state.timePosition >= self.state.timeLength)) {
        clearInterval(progress)
        console.debug(`tick: exiting tick loop`)
    } else
        // progression += 1000
        self.state.timePosition += 10
    }, 10)
  }

  play(tlid = null) {
    try {
      console.debug("play")
      if (tlid == null)
        this.client.playback.play()
      else {
        this.client.playback.play(tlid)
      }
    } catch(e) {
      console.warn("exception when calling play(): " + e)
    }
  }

  pause() {
    try {
      console.debug("pause")
      this.client.playback.pause()
    } catch(e) {
      console.warn("exception when calling pause(): " + e)
    }
  }

  resume() {
    try {
      console.debug("resume")
      this.client.playback.resume()
    } catch(e) {
      console.warn("exception when calling resume(): " + e)
    }
  }

  stop() {
    try {
      console.debug("stop")
      this.client.playback.stop()
      this.client.playback.seek("0")
      console.debug("after stop")
    } catch(e) {
      console.warn("exception when calling stop(): " + e)
    }
  }

  next() {
    try {
      console.debug("next")
      this.client.playback.next()
    } catch(e) {
      console.warn("exception when calling next(): " + e)
    }
  }

  previous() {
    try {
      console.debug("previous")
      this.client.playback.previous()
    } catch(e) {
      console.warn("exception when calling previous(): " + e)
    }
  }

  getCurrentTrack() {
    try {
      console.debug("getCurrentTrack")
      this.client.playback.getCurrentTlTrack().then( currentTrack => {
        console.debug("current track:" + JSON.stringify(this.state.currentTrack))
        this.analyzeTrack(currentTrack)
        // this.getPlayingState()
        return currentTrack
      })
    } catch(e) {
      console.warn("exception when calling getCurrentTrack(): " + e)
    }
  }

  analyzeTrack(tlTrack) {
    console.debug(`analyzing track ${JSON.stringify(tlTrack)}`)
    this.state.currentTrack = tlTrack
    this.state.playingType = this.interpretPlayingType(tlTrack)
    this.state.timeLength = tlTrack.track.length
    console.debug(`analyzeTrack. playingType: ${this.state.playingType}`)
    // self.state.playingState = 'playing'
  }

  seek(timePosition) {
    try {
      console.debug("seek to time position " + timePosition)
      this.state.timePosition = timePosition
      return this.client.playback.seek(timePosition)
    } catch(e) {
      console.warn("exception when calling seek(): " + e)
    }
  }

  getTimePosition() {
    try {
      console.debug(`getTimePosition`)
      return this.client.playback.getTimePosition().then( currentTime => {
        console.debug(`getTimePosition: setting time position to ${currentTime}`)
        this.state.timePosition = currentTime
      })
    } catch(e) {
      console.warn("exception when calling getTimePosition(): " + e)
    }
  }

  getPlayingState(newState = null) {
    try {
      console.debug(`getPlayingState. current: ${this.state.playingState}, new state: ${newState}`)
      if (newState !== null) {
        console.debug(`getPlayingState. using provided parameter ${newState}`)
        if (newState !== this.state.playingState) {
          this.state.playingState = newState
          if (this.state.playingState === 'playing') {
            console.debug(`getPlayingState. changed to 'playing' state. starting time loop`)
            this.getTimePosition().then (currentTime => {
              console.debug(`setting time position to ${this.state.timePosition}`)
              this.tick(this.state.timePosition, this.state.timeLength)
            })
          }
        }
        // return this.state.playingState
      } else {
        let self = this
        this.client.playback.getState().then( playState => {
          console.debug(`getPlayingState. using acquired getState() parameter ${playState}`)
          // console.debug("getPlayingState: current play state: " + JSON.stringify(playState))
          if (self.state.playingState !== playState) {
            self.state.playingState = playState
            if (self.state.playingState === 'playing') {
              console.debug(`getPlayingState. changed to 'playing' state. starting time loop`)
              self.getTimePosition().then (currentTime => {
                console.debug(`setting time position to ${self.state.timePosition}`)
                self.tick(this.state.timePosition, this.state.timeLength)
              })
            }
            // this.publishEvent(new PlayingStateChanged(this.state.playingState))
          }
          // return this.state.playingState
        })
      }
      return this.state.playingState

    } catch(e) {
      console.warn("exception when calling getPlayingState(): " + e)
    }
  }

  // getPlayingType(trackInfo = null) {
  //   try {
  //     console.debug(`getPlayingType. trackInfo: ${trackInfo}`)
  //     let self = this
  //
  //     if (trackInfo != null) {
  //       console.debug(`getPlayingType. analyzing trackInfo, as it was provided: ${JSON.stringify(trackInfo)}`)
  //       return new Promise(resolve, reject => {
  //         resolve(self.interpretPlayingType(trackInfo))
  //       })
  //     }
  //     else {
  //       console.debug(`getPlayingType. no trackInfo provided. acquiring`)
  //       return this.client.playback.getCurrentTrack().then( trackInfo => {
  //         self.interpretPlayingType(trackInfo)
  //       })
  //     }
  //   } catch(e) {
  //     console.warn("exception when calling getPlayingType(): " + e)
  //   }
  // }

  interpretPlayingType(trackInfo) {
    console.debug(`interpretPlayingType: ${JSON.stringify(trackInfo)}`)
    if (trackInfo === null) {
      console.debug("interpretPlayingType: nothing playing")
      return "nothing"
    }
    else if (trackInfo.track.uri.startsWith("local:track")) {
      console.debug("interpretPlayingType: local track")
      return "local"
    }
    else {
      console.debug("interpretPlayingType: streaming")
      return "streaming"
    }
  }

}
