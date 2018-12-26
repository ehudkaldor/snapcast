import { bindable } from 'aurelia-framework'

export class DashSearch {

  @bindable client

  attached() {
    console.debug("attached")
  }
}
