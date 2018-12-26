import { bindable, inject } from 'aurelia-framework'
import { MopidyClient } from 'services/mopidy-client.js'

@inject(MopidyClient)
export class Broadcaster {

  @bindable client

  constructor(client) {
    console.debug("c'tor")
    this.client = client
  }

  attached() {
    console.debug("attached")
  }

  detached() {
    console.debug("detached")
  }
}
