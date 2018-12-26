import { bindable, inject } from 'aurelia-framework'
// import "../../../node_modules/semantic-ui-range/range"
import { EventAggregator } from 'aurelia-event-aggregator'
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import { VolumeChanged, MuteChanged } from 'events/volumeEvents.js'

@inject(EventAggregator)
export class DashVolume {

  @bindable orientation
  @bindable client
  step = 5
  // volume = 0
  // isMute = false
  disabled = true
  muteText = ""
  volUpText = ""
  volDownText = ""
  volColor = ""
  // volumeCallback = this.volumeChangedCallback

  constructor(eventAggregator) {
    console.debug("constructor volume-dash. client: " + JSON.stringify(this.client))
    this.ea = eventAggregator
  }

  subscribeToEvents(){
    return this.ea.subscribe(this.client.url, msg => {
      switch(msg.constructor) {
        case Connected:
          // console.debug("message listener: got Connected message. isConnected: " + msg.isConnected)
          // if (msg.isConnected) {
            console.debug("message listener: got message: connected")
            this.enable()
          // } else {
            // console.debug("message listener: got message: disconnected")
            // this.disable()
          break
        case Disconnected:
          console.debug("message listener: got message: disconnected")
          this.disable()
          break

        case VolumeChanged:
          console.debug("message listener: got message: volume changed to " + JSON.stringify(msg))
          // this.volume = msg.vol
          break
        case MuteChanged:
          this.setMuteText()
          console.debug("message listener: got message: mute changed to " + JSON.stringify(this.client.state.isMute))
          break
        case ClientState:
          console.debug("got ClientState: " + JSON.stringify(msg))
          // this.volume = msg.state.volume
          if (msg.state.connected) {
            console.debug("message listener: got message: connected")
            this.enable()
          } else {
            console.debug("message listener: got message: disconnected")
            this.disable()
          }
          break
        default:
          console.debug("message listener: got unknown message: " + JSON.stringify(msg) + " of type " + typeof msg.constructor)
      }
    })
  }

  enable() {
    this.disabled = false
    this.volUpText = "Volume Up"
    this.volDownText = "Volume Down"
    this.setMuteText()
  }

  disable() {
    this.disabled = true
    this.muteText = ""
    this.volUpText = ""
    this.volDownText = ""
  }

  setMuteText() {
    this.muteText = this.client.state.isMute ? "Mute (currently muted)" : "Mute (currently unmuted)"
  }

  volumeChangedCallback(value) {
    console.debug(`volume slider changed to ${value}`)
    new Promise(resolve => {
      resolve(this.client.mixerController.setVolume({volume:value}))
    })
  }

  attached() {
    console.debug("attached volume-dash. orientation: " + JSON.stringify(this.orientation) + ", client: " + JSON.stringify(this.client))
    // let classes = ".volume.item." + this.client.name
    // $(classes).dimmer({'variation':'inverted', 'closable':false}).dimmer('show')
    // this.disabled = true
    this.disable()
    this.subscription = this.subscribeToEvents()
    this.client.pushState()
  }

  detached() {
    console.debug("detached")
    this.subscription.dispose()
  }

  created() {
    console.debug("created volume-dash. orientation: " + JSON.stringify(this.orientation) + ", client: " + JSON.stringify(this.client))
  }

  volumeUp() {
    if (!this.disabled) {
      console.debug("volumeUp. current volume: " + JSON.stringify(this.volume) + " and increasing by " + this.step)
      this.client.mixerController.setVolume({volume:Math.min( this.client.state.volume+this.step, 100) })
      // .then( res => {
      //   console.debug("vol up response: " + JSON.stringify(res))
      // })
    }
  }

  volumeDown() {
    if (!this.disabled) {
      console.debug("volumeDown. orientation: " + JSON.stringify(this.orientation) + ", client: " + JSON.stringify(this.client))
      this.client.mixerController.setVolume({volume:Math.max( this.client.state.volume-this.step, 0 )})
      // .then( res => {
      //   console.debug("vol down response: " + JSON.stringify(res))
      // })
    }
  }

  toggleMute() {
    if (!this.disabled) {
      console.debug("toggle mute. current mute state: " + this.client.state.isMute)
      this.client.mixerController.toggleMute()
    }
  }
}
