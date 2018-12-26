export class TracklistController {
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

  add() {

  }

  remove() {

  }

  clear() {

  }

  move() {

  }

  shuffle() {

  }

  getRandom() {

  }

  setRandom(changeTo){

  }

  getRepeat() {

  }

  setRepeat(changeTo) {

  }

  getNextTrack(nextTo) {
    try {
      console.debug("getNextTrack")
      this.client.tracklist.nextTrack(JSON.parse(nextTo)).then( nextTrack => {
        this.state.nextTrack = nextTrack
        console.debug("next track: " + JSON.stringify(this._state.nextTrack))
        return nextTrack
      })
    } catch(e) {
      console.warn("exception when calling getNextTrack(): " + e)
    }
  }

  getPrevTrack(previousTo) {
    try {
      console.debug("getPrevTrack")
      this.client.tracklist.previousTrack(JSON.parse(previousTo)).then( prevTrack => {
        this.state.previousTrack = prevTrack
        console.debug("previous track: " + JSON.stringify(this._state.previousTrack))
        return prevTrack
      })
    } catch(e) {
      console.warn("exception when calling getPrevTrack(): " + e)
    }
  }

  getTracks() {
    try {
      console.debug("getTracks")
      return this.client.tracklist.getTlTracks()
    } catch(e) {
      console.warn("exception when calling getTracks(): " + e)
    }
  }

}
