import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator'
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import { PlayingStateChanged, PlayingStarted, PlayingEnded, PlayingPaused, PlayingResumed } from 'events/playEvents.js'
import { TimeFormatValueConverter } from 'resources/value-converters/time-format'

@inject(EventAggregator)
export class DashStreamDetails {
  @bindable client
  stream_text = ""
  uri_text = ""
  current_pos = 0
  time_text = 0

  constructor(eventAggregator) {
    this.ea = eventAggregator
  }

  attached() {
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


  subscribeToEvents(){
    return this.ea.subscribe(this.client.url, msg => {
      switch(msg.constructor) {
        case Connected:
          console.debug("message listener: got message: connected")
          this.enable()
          break
        case Disconnected:
          console.debug("message listener: got message: disconnected")
          this.disable()
          break
        case ClientState:
          console.debug("got ClientState: " + JSON.stringify(msg))
          if (msg.state.connected) {
            console.debug("message listener: got message: connected")
            // this.time_text = this.client.state.currentTrack.track.length
            // console.debug("track length: " + this.time_text)
            this.enable()
          } else {
            console.debug("message listener: got message: disconnected")
            // this.disable()
          }
          break
        case PlayingStateChanged:
          console.debug("got PlayingStateChanged: " + JSON.stringify(msg))
          if (msg.newState == 'playing') {
            console.debug("message listener: got message: PlayingStateChanged to playing")
            this.enable()
          } else {
            console.debug("message listener: got message: PlayingStateChanged to " + msg.newState)
            // this.disable()
          }
          break
          case PlayingStarted:
            console.debug("got PlayingStarted: " + JSON.stringify(msg))
            this.current_pos = 0
            this.time_text = this.client.state.currentTrack.track.length
            console.debug("track length: " + this.time_text)
          break
          case PlayingEnded:
            console.debug("got PlayingEnded: " + JSON.stringify(msg))
            this.current_pos = 0
            this.time_text = this.client.state.currentTrack.track.length
            console.debug("track length: " + this.time_text)
            break
          case PlayingPaused:
            console.debug("got PlayingPaused: " + JSON.stringify(msg))
            this.current_pos = msg.time_position
            this.time_text = this.client.state.currentTrack.track.length
            console.debug("track length: " + this.time_text)
            break
          case PlayingResumed:
            console.debug("got PlayingResumed: " + JSON.stringify(msg))
            this.current_pos = msg.time_position
            this.time_text = this.client.state.currentTrack.track.length
            console.debug("track length: " + this.time_text)
            break
        default:
          console.debug("message listener: got unknown message: " + JSON.stringify(msg) + " of type " + typeof msg.constructor)
      }
    })
  }

  enable() {
    if (this.client.state.currentTrack != null) {
      this.stream_text = this.client.state.currentTrack.track.name
      this.uri_text = this.client.state.currentTrack.track.uri
    }
  }

  disable() {
    this.stream_text = ""
    this.uri_text = ""
  }
}
