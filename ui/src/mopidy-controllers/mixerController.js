export class MixerController {
  client = null
  state = null

  constructor(client, state) {
    this.client = client
    this.state = state
  }

  getVolume() {
    try {
      console.debug("getVolume")
      return this.client.mixer.getVolume()
      // .then( volume => {
      //   console.debug("getVolume then: " + volume)
      //   this.state.volume = volume
      // })
    } catch(e) {
      console.warn("exception when calling getVolume(): " + e)
    }
  }

  setVolume(vol) {
    try {
      console.debug("setVolume. setting volume to : " + JSON.stringify(vol))
      this.client.mixer.setVolume(vol)
    } catch(e) {
      console.warn("exception when calling setVolume(): " + e)
    }
  }

  getMute() {
    try {
      console.debug("getMute")
      return this.client.mixer.getMute()
      // .then( isMute => {
      //   console.debug("getMute then: " + isMute)
      //   this.state.isMute = isMute
      //   // this.eventAggregator.publish(new MuteChanged(isMute))
      //   this.publishEvent(new MuteChanged(isMute))
      // })
    } catch(e) {
      console.warn("exception when calling getMute(): " + e)
    }
  }

  toggleMute(changeTo = null) {
    try {
      let wantedState = false
      if (changeTo == null) {
        wantedState = this.getMute().then( currentMute => {
          console.debug("toggleMute with no param. toggling to mute to: " + JSON.stringify(!currentMute))
          this.client.mixer.setMute([!currentMute])
        })
      } else {
        console.debug("toggleMute. toggling to mute to: " + JSON.stringify(wantedState))
        this.client.mixer.setMute([changeTo])
      }
    } catch(e) {
      console.warn("exception when calling toggleMute(): " + e)
    }
  }
}
