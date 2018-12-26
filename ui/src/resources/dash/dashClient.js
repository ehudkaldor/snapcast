import { bindable } from 'aurelia-framework'

export class DashClient {
  // imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rami_Malek_in_Hollywood%2C_California.jpg/400px-Rami_Malek_in_Hollywood%2C_California.jpg"
  orientation = "vertical"
  controlSidebar = ".seven.wide.column"
  button = ".ui.button"
  progress = 10
  @bindable client

  isPlayingType(wantedState) {
    console.debug(`checking playing type. wanted: ${wantedState}, known: ${this.client.state.playingType}`)
    return this.client.state.playingType === wantedState
  }


  attached() {
    console.debug("attached dash-client. client: " + JSON.stringify(this.client))
    // $('.ui.sidebar')
    // .sidebar({
    //   context: $('.pushable')
    // })
    // .sidebar('attach events', '.eight.wide.violet.column')
  }
}
