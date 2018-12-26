import { Snapcast } from 'services/snapcast.js'
import { bindable, inject } from 'aurelia-framework'

@inject(Snapcast)
export class Clients {

  constructor(snapcast) {
    this.snapcast = snapcast
  }

}
