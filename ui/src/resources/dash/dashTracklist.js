import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import { TracklistChanged } from 'events/tracklistEvents.js'

@inject(EventAggregator)
export class DashTracklist {

  @bindable client

  constructor(eventAggregator) {
    console.debug("constructor tracklist-dash. client: " + JSON.stringify(this.client))
    this.ea = eventAggregator
  }

  subscribeToEvents(){
    return this.ea.subscribe(this.client.url, msg => {
      switch(msg.constructor) {
        case Connected:
          console.debug("message listener: got Connected message")
          this.enable()
          break
        case Disconnected:
          console.debug("message listener: got Disonnected message")
          this.disable()
          break
      }
    })
  }

  enable() {

  }

  disable() {

  }

  attached() {
    console.debug("attached tracklist-dash. client: " + JSON.stringify(this.client))
    this.disable()
    this.subscription = this.subscribeToEvents()
    this.client.pushState()
  }

  detached() {
    console.debug("detached")
    this.subscription.dispose()
  }

}
