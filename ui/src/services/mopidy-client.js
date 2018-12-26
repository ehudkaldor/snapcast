import Mopidy from 'mopidy'
import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject, computedFrom } from 'aurelia-framework'
import { Connected, Disconnected, ClientState } from 'events/connectionEvents.js'
import { VolumeChanged, MuteChanged } from 'events/volumeEvents.js'
import { TracklistChanged } from 'events/tracklistEvents.js'
import { PlayingStateChanged, PlayingStarted, PlayingEnded, PlayingPaused, PlayingResumed } from 'events/playEvents.js'
import { PlaybackController } from 'mopidy-controllers/playbackController.js'
import { PlaylistsController } from 'mopidy-controllers/playlistsController.js'
import { MixerController } from 'mopidy-controllers/mixerController.js'
import { TracklistController } from 'mopidy-controllers/tracklistController.js'
import { HistoryController } from 'mopidy-controllers/historyController.js'
import { State } from './state.js'

@inject(EventAggregator)
export class MopidyClient {

  _state = new State()

  constructor(eventAggregator, params) {
    this.eventAggregator = eventAggregator
    if (params != null){
      this._params = params
      console.debug("got params! " + JSON.stringify(params))
      // this.name = (params.name === "undefined" ? "Nameless" : params.name)
      // this.url = params.clientURL
      // if (params.addr != null && params.port != null) {
      //   this.addr = params.addr.trim()
      //   this.port = params.port
      // } else {
      //   this.breakUrl(params.url.trim())
      // }
      this.connect()
    } else {
      console.debug("no params found")
    }
  }

  get params() {
    return this._params
  }

  get name() {
    return this._params.name
  }

  // checkParams(params) {
  //   console.debug(`params: ${JSON.stringify(params)}, client: ${JSON.stringify(this.url)}`)
  //   if ((params.url && params.url.trim() === this.url.trim()) ||
  //     (params.addr != "" && "ws://" + params.addr.trim() + ":" + params.port + "/mopidy/ws" === this.url.trim())
  //   ) {
  //     console.debug("checkParams returning true")
  //     return true
  //   }
  //   else {
  //     console.debug("checkParams returning false")
  //     return false
  //   }
  // }

  @computedFrom
  get url() {
    return `ws://${this.params.addr}:${this.params.port}/mopidy/ws`
  }

  // breakUrl(url){
  //   let slashSlashIndex = url.indexOf("//")
  //   console.debug(`breakUrl: indexOf('/'): ${slashSlashIndex}`)
  //   let collon = url.indexOf(":", slashSlashIndex+1)
  //   console.debug(`breakUrl: indexOf(':'): ${collon}`)
  //   this.addr = url.substring(slashSlashIndex+2, collon)
  //   this.port = url.substring(collon+1, url.indexOf('/', collon))
  //   console.debug(`breakUrl: address: ${this.addr}`)
  //   console.debug(`breakUrl: port: ${this.port}`)
  // }

  get state() {
    return this._state
  }

  set state(value) {
    this._state = value
  }

  connect() {
    try {
      let client = new Mopidy({
        webSocketUrl: this.url,
        callingConvention : 'by-position-or-by-name'
      })
      console.debug(`connected to url ${this.url}`)
      this.client = client
      console.debug(`created mopidy client for url ${this.url}`)
      console.debug(`client: ${JSON.stringify(this.client)}`)
      // let state = new State()
      // this.state = state
      // this.playbackController = new PlaybackController(client, state)
      // this.playlistsController = new PlaylistsController(client, state)
      // this.mixerController = new MixerController(client, state)
      // this.tracklistController = new TracklistController(client, state)
      // this.historyController = new HistoryController(client, state)
      this.client.on(this.onEvent.bind(this))
      this.client.onerror = (e) => {
        console.warn(`error connecting to mopidy client url ${this.url}`)
      }
      console.debug(`finished connect() for url ${this.url}`)
    } catch (e) {
      console.warn(`could not connect to ${this.params.name}: ${e}`)
    }
  }

  init() {
    console.log('init()');
    let state = new State()
    this.state = state
    this.playbackController = new PlaybackController(this.client, state)
    this.playlistsController = new PlaylistsController(this.client, state)
    this.mixerController = new MixerController(this.client, state)
    this.tracklistController = new TracklistController(this.client, state)
    this.historyController = new HistoryController(this.client, state)

    console.debug(`init(). calling updateTracklist`)
    this.updateTracklist()
    console.debug(`init(). calling getVolume`)
    this.mixerController.getVolume().then( currentVol => {
      console.debug("current vol: " + currentVol)
      this.state.volume = currentVol
    })
    console.debug(`init(). calling getMute`)
    this.mixerController.getMute().then( muteState => {
      this.state.isMute = muteState
    })
    console.debug(`init(). calling getPlaylists`)
    this.state.playlists = this.playlistsController.getPlaylists()
    console.debug(`init(). calling getCurrentTrack`)
    this.playbackController.getCurrentTrack()//.then( currentTrack => {
    //   this._state.currentTrack = currentTrack
    //   console.debug("current track:" + JSON.stringify(this._state.currentTrack))
    // })
    // this._state.playingState = this.playbackController.getPlayingState()
    console.debug(`init(). calling getPlayingState`)
    this.playbackController.getPlayingState()//.then( playingState => {
    console.debug(`init(). calling getTimePosition`)
    this.playbackController.getTimePosition()//.then( playingState => {
    //   this._state.playingState = playingState
    //   console.debug("getState: current play state: " + JSON.stringify(playingState))
    //   this.publishEvent(new PlayingStateChanged(this.state.playingState))
    // })
    console.debug(`init(). pushing completed state: ${JSON.stringify(this.state)}`)
    this.pushState()
  }

  publishEvent(msg) {
    this.eventAggregator.publish(this.url, msg)
  }

  pushState() {
    let mystate = Object.assign({}, this.state)
    console.debug(`pushing state: ${JSON.stringify(mystate)}`)
    this.publishEvent(new ClientState(mystate))
  }

  getCurrentTrack() {
    console.debug("getCurrentTrack")
    this.playbackController.getCurrentTrack()//.then( currentTrack => {
    //   this.state.currentTrack = currentTrack
    //   // this.getPrevTrack(currentTrack)
    //   // this.getNextTrack(currentTrack)
    //   console.debug("current track:" + JSON.stringify(this._state.currentTrack))
    // })
  }

  getNextTrack(nextTo) {
    console.debug("getNextTrack")
    this.tracklistController.getNextTrack(nextTo)
    // this.client.tracklistController.getNextTrack(nextTo).then( nextTrack => {
    // this.client.tracklist.nextTrack(nextTo).then( nextTrack => {
    //   this._state.nextTrack = nextTrack
    //   console.debug("next track: " + JSON.stringify(this._state.nextTrack))
    // })
  }

  getPrevTrack(previousTo) {
    console.debug("getPrevTrack")
    this.tracklistController.getPrevTrack(previousTo)
    // // this.client.tracklistController.getPrevTrack(previousTo).then( prevTrack => {
    // this.client.tracklist.previousTrack(previousTo).then( prevTrack => {
    //   this._state.previousTrack = prevTrack
    //   console.debug("previous track: " + JSON.stringify(this._state.previousTrack))
    // })
  }

  getPlaylists() {
    console.debug("getPlayLists")
    this.playlistsController.getPlaylists()
  }

  // getPlayingState() {
  //   console.debug("calling getState")
  //   console.debug("getState" + JSON.stringify(this.client.playback.getState()))
  //   this.client.playback.getState().then( playState => {
  //     console.debug("getState: current play state: " + JSON.stringify(playState))
  //     this.state.playingState = playState
  //     this.publishEvent(new PlayingStateChanged(this.state.playingState))
  //   })
  // }

  updateTracklist() {
    console.debug("updateTrackList")
    this.tracklistController.getTracks().then( tracks => {
      this.state.trackList = tracks
      this.publishEvent(new TracklistChanged())
    })
    .catch ( e => {
      console.error(`error in updateTracklist: ${e}`)
    })
  }

  tick() {
    // if(this.isPlaying && !this.seeking) {
    //   this.timePosition = parseInt(this.timePosition) + 1000;
    // }
  }

  onEvent(event,data) {
    switch(event) {
      case 'state:online':
        console.debug('got state:online. calling init()')
        this.init();
        console.debug('got state:online. setting state to connected==true')
        this.state.connected = true;
        console.debug('got state:online. publishing Connected() event')
        this.publishEvent(new Connected())
        break;
      case 'state:offline':
        console.debug('got state:offline')
        this.state.connected = false
        this.publishEvent(new Disconnected())
        break;
      case 'event:trackPlaybackStarted':
        this.playbackController.getPlayingState("playing")
        this.playbackController.getCurrentTrack(data.tl_track)
        // this.state.playingState = 'playing'
        this.publishEvent(new PlayingStarted())
        break;
      case 'event:trackPlaybackEnded':
        console.debug('got event:trackPlaybackEnded')
        this.playbackController.getPlayingState("stopped")
        this.playbackController.getCurrentTrack(data.tl_track)
        // this.state.playingState = 'stopped'
        this.publishEvent(new PlayingEnded(data.time_position))
        break;
      case 'event:trackPlaybackResumed':
        console.debug('got event:trackPlaybackResumed')
        this.playbackController.getPlayingState("playing")
        this.playbackController.getCurrentTrack(data.tl_track)
        // this.state.playingState = 'playing'
        this.publishEvent(new PlayingResumed(data.time_position))
        break;
      case 'event:trackPlaybackPaused':
        console.debug('got event:trackPlaybackPaused')
        this.playbackController.getPlayingState("paused")
        this.playbackController.getCurrentTrack(data.tl_track)
        // this.state.playingState = 'paused'
        this.publishEvent(new PlayingPaused(data.time_position))
        break;
      case 'event:tracklistChanged':
        this.updateTracklist();
        console.debug('got event:tracklistChanged')
        break;
      case 'event:volumeChanged':
        console.debug('new volume ' + data.volume);
        this.state.volume=data.volume;
        // this.eventAggregator.publish(new VolumeChanged(this.volume))
        this.publishEvent(new VolumeChanged(this.state.volume))
        break;
      case 'event:muteChanged':
        console.debug('mute set to ' + data.mute)
        this.state.isMute=data.mute
        // this.eventAggregator.publish(new MuteChanged(this.isMute))
        this.publishEvent(new MuteChanged(this.state.isMute))
        break
      case 'event:playbackStateChanged':
        this.playbackController.getPlayingState(data.new_state)
        console.debug('got event:playbackStateChanged from ' + data.old_state + ', to ' + data.new_state)
        this.publishEvent(new PlayingStateChanged(data.new_state))
        break;
      case 'event:seeked':
        // this.state.timePosition = data.time_position
        console.debug(`got event:seeked. time position ${data.time_position}`)
        this.playbackController.getTimePosition()
        break;
      case 'event:playlistDeleted':
        this.getPlaylists();
        break;
      case 'event:playlistChanged':
        this.getPlaylists();
        break;
      case 'event:streamTitleChanged':
        this.state.title = data.title;
        console.log(data.title);
        break
      // default:
      //   console.log("event: " + JSON.stringify(event))
      //   console.log("data: " + JSON.stringify(data))
    }
    console.log("event: " + JSON.stringify(event) + "********** data: " + JSON.stringify(data))
  }
}
