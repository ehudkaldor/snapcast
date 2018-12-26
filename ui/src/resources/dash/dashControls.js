import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator'
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import { PlayingStateChanged } from 'events/playEvents.js'

@inject(EventAggregator)
export class DashControls {

  @bindable client
  disabled = true
  playText = ""
  pauseText = ""
  stopText = ""
  forwardText = ""
  backText = ""
  skipForwardText = ""
  skipBackText = ""
  isPlaying = false

  constructor(eventAggregator) {
    this.ea = eventAggregator
  }

  subscribeToEvents(){
    return this.ea.subscribe(this.client.url, msg => {
      console.debug("message listener: got message: " + JSON.stringify(msg) + " of type " + typeof msg)
      switch(msg.constructor) {
        case Connected:
          // let classes = ".control.item." + this.client.name
          // if (msg.isConnected) {
            console.debug("message listener: got message: connected")
            this.enable()
          // } else {
          //   console.debug("message listener: got message: disconnected")
          //   this.disable()
          // }
          break
        case Disconnected:
          console.debug("message listener: got message: disconnected")
          this.disable()
          break
        case ClientState:
          if (msg.state.connected) {
            console.debug("message listener: got message: connected")
            this.enable()
          } else {
            console.debug("message listener: got message: disconnected")
            this.disable()
          }
          break
        case PlayingStateChanged:
          console.debug("message listener: got message: PlayingStateChanged, to " + msg.newState)
          this.isPlaying = msg.newState == "playing" ? true : false
          console.log("is playing? " + this.isPlaying)
          break
      }
    })
  }

  attached() {
    console.debug("attachded")
    // let classes = ".control.item." + this.client.name
    // $(classes).dimmer({'variation':'inverted', 'closable':false}).dimmer('show')
    this.disabled = true
    this.subscription = this.subscribeToEvents()
    this.client.pushState()
  }

  detached(){
    console.debug("detached")
    this.subscription.dispose()
  }

  enable() {
    this.playText = "Play"
    this.pauseText = "Pause"
    this.stopText = "Stop"
    this.forwardText = "Forward"
    this.backText = "Backward"
    this.skipForwardText = "Skip Forward"
    this.skipBackText = "Skip Backward"
    this.disabled = false
  }

  disable() {
    this.playText = ""
    this.pauseText = ""
    this.stopText = ""
    this.forwardText = ""
    this.backText = ""
    this.skipForwardText = ""
    this.skipBackText = ""
    this.disabled = true
  }

  created() {
    console.debug("created")
  }

  play() {
    if (!this.disabled){
      console.debug("play clicked")
      this.client.playbackController.play()
    } else {
      console.debug("Play clicked while disabled")
    }
  }

  pause() {
    if (!this.disabled){
      console.debug("pause clicked")
      this.client.playbackController.pause()
      console.debug("in pause(). client: " + JSON.stringify(this.client))
    } else {
      console.debug("pause clicked while disabled")
    }
  }

  stop() {
    if (!this.disabled){
      console.debug("stop clicked")
      this.client.playbackController.stop()
      console.debug("in stop(). client: " + JSON.stringify(this.client))
    } else {
      console.debug("stop clicked while disabled")
    }
  }

  resume() {
    if (!this.disabled){
      console.debug("resume clicked")
      this.client.playbackController.resume()
    }
  }

  forward() {
    if (!this.disabled){
      console.debug("forward clicked")
      this.client.playbackController.forward()
    }
  }

  back() {
    if (!this.disabled){
      console.debug("back clicked")
      this.client.playbackController.back()
    }
  }

  previous() {
    if (!this.disabled){
      console.debug("skipBack clicked")
      this.client.playbackController.previous()
    }
  }

  next() {
    if (!this.disabled){
      console.debug("skipForward clicked")
      this.client.playbackController.next()
    }
  }
}
