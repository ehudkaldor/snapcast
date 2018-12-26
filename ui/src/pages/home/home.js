import { bindable, inject } from 'aurelia-framework'
import { MultiMopidy } from 'services/multi-mopidy.js'

@inject(MultiMopidy)
export class Home {

  clients = []

  @bindable mm;

  constructor(multiMopidy){
    this.mm = multiMopidy;
    // this.mm.addClient("ehud", "ws://localhost:6680/mopidy/ws/").then( x =>
    //   console.debug("ctor after adding. multimop: " + JSON.stringify(this.mm))
    // )
    // this.mm.addClient("ehud2", "ws://localhost:6681/mopidy/ws/").then( x =>
    //   console.debug("ctor after adding. multimop: " + JSON.stringify(this.mm))
    // )
    // console.debug("ctor. multimop: " + JSON.stringify(this.mm))
    // this.mmChanged()
    this.mm.getClients().then( clients => {
      console.debug("this.mm.getClients() then returned " + JSON.stringify(clients))
      this.clients = clients
    })
  }

  mmChanged() {
    this.mm.getClients().then( clients => {
      console.debug("mmChanged then returned " + JSON.stringify(clients))
      // this.clients = clients
    })
  }
}
