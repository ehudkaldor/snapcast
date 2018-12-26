import { PLATFORM } from 'aurelia-pal';
import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { Router, RouterConfiguration } from 'aurelia-router';
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import * as $ from 'jquery';

@inject(Router, EventAggregator)
export class Dashboard {

  @bindable client

  constructor(router, eventAggregator) {
    this.ea = eventAggregator
    this.router = router
    this.heading = 'Child Router';
    router.configure(config => {
      config.map([
        // { route: 'home/', redirect: 'home/client' },
        { route: 'home/client',        name: 'client',       moduleId: PLATFORM.moduleName('./dashClient'),   nav: false, title: 'Client Defails' },
        { route: 'home/playlist',      name: 'playlist',     moduleId: PLATFORM.moduleName('./dashPlaylist'), nav: false, title: 'Playlist' },
        { route: 'home/song',          name: 'song',         moduleId: PLATFORM.moduleName('./dashSong'),     nav: false, title: 'Song' }
      ])
    })
  }

  subscribeToEvents(){
    return this.ea.subscribe(this.client.url, msg => {
      console.debug("message listener: got message: " + JSON.stringify(msg) + " of type " + typeof msg)
      // let dimmable = ".ui.grid." + this.client.name
      switch(msg.constructor) {
        case Connected:
          // if (msg.isConnected != this.)
          // if (msg.isConnected) {
            console.debug("message listener: got message: connected")
            this.enable()
            // $(dimmable).dimmer('hide')
            // this.disabled = false
          // } else {
            // console.debug("message listener: got message: disconnected")
            // this.disable()
            // $(dimmable).dimmer({'variation':'inverted', 'closable':false}).dimmer('show')
            // this.disabled = true
          // }
          break

        case Disconnected:
          console.debug("message listener: got message: disconnected")
          this.disable()
          break

        case ClientState:
          console.debug("got ClientState: " + JSON.stringify(msg))

          if (msg.state.connected) {
            console.debug("message listener: got message: connected")
            this.enable()
          } else {
            console.debug("message listener: got message: disconnected")
            this.disable()
          }

          // this.isMute = msg.state.isMute
          // classes = ".volume.item." + this.client.name
          // if (msg.state.connected) {
          //   console.debug("message listener: got ClientState: connected")
          //   this.enable()
          //   // $(dimmable).dimmer('hide')
          //   // this.disabled = false
          // } else {
          //   console.debug("message listener: got ClientState: disconnected")
          //   this.disable()
          //   // $(dimmable).dimmer({'variation':'inverted', 'closable':false}).dimmer('show')
          //   // this.disabled = true
          // }
          break
      }
    })
  }

  enable() {
    let dimmable = ".ui.grid." + this.client.name
    $(dimmable).dimmer('hide')
    // this.disabled = false
  }

  disable() {
    let dimmable = ".ui.grid." + this.client.name
    $(dimmable).dimmer({'variation':'inverted,blurring', 'closable':false}).dimmer('show')
    // this.disabled = true
  }

  attached(){
    console.debug("dashboard attached. client: " + JSON.stringify(this.client))
    this.disable()
    // let classes = ".ui.grid." + this.client.name
    // $(classes).dimmer({'variation':'inverted', 'closable':false}).dimmer('show')
    this.subscription = this.subscribeToEvents()
    this.client.pushState()
  }

  detached() {
    console.debug("detached")
    this.subscription.dispose()
  }

  // @bindable client
  // @bindable router
  // heading = 'Child Router';
  // configureRouter(config, router) {
  //   config.map([
  //     { route: '', redirect: 'client' },
  //     { route: 'client',        name: 'client',       moduleId: PLATFORM.moduleName('./dashClient'),   nav: true, title: 'Client Defails' },
  //     { route: 'playlist',      name: 'playlist',     moduleId: PLATFORM.moduleName('./dashPlaylist'), nav: true, title: 'Playlist' },
  //     { route: 'song',          name: 'song',         moduleId: PLATFORM.moduleName('./dashSong'),     nav: true, title: 'Song' }
  //   ])
  //
  //   this.router = router
  // }
}
