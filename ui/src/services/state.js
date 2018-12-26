export class State {
  _playingState = false
  _playingType = "none"

  libraryURI = null
  _tracklist = []
  _timePosition = 0
  _timeLength = -1
  seeking = false

  volume = 0
  isMute = false

  _currentTrack = null
  nextTrack = null
  prevTrack = null

  title = ""
  playlists = []
  connected = false

  get tracklist() {
    return this.tracklist
  }

  set tracklist(value) {
    this.tracklist = value
    console.debug("track list changed to " + JSON.stringify(this._tracklist))
  }

  get currentTrack() {
    return this._currentTrack
  }

  set currentTrack(value) {
    this._currentTrack = value
    console.debug("current track changed to " + JSON.stringify(this._currentTrack))
  }

  get timePosition() {
    return this._timePosition
  }

  set timePosition(value) {
    this._timePosition = value
    // console.debug("time position set to " + JSON.stringify(this._timePosition))
  }

  get timeLength() {
    return this._timeLength
  }

  set timeLength(value) {
    this._timeLength = value
    console.debug(`time length set to ${this._timeLength}`)
  }

  get playingType() {
    return this._playingType
  }

  set playingType(value) {
    this._playingType = value
    console.debug("playing type changed to " + this._playingType)
  }
}
