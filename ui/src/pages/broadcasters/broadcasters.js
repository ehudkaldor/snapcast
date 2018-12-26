import { bindable, inject } from 'aurelia-framework'
import { MultiMopidy } from 'services/multi-mopidy.js'
import { Snapcast } from 'services/snapcast.js'
import { NewClientModel } from 'models/newClientModel.js'
import { Router } from 'aurelia-router'
import * as $ from 'jquery';

@inject(MultiMopidy, Snapcast, Router)
export class Broadcasters {
  clients = []

  @bindable mm;

  addText = "Add Broadcaster"
  headerText = "Broadcasters"

  constructor(multiMopidy, snapcast, router) {
    console.debug("c'tor")
    this.router = router
    this.snapcast = snapcast
    this.snapcast.serverGetStatus()
    this.mm = multiMopidy
    this.mm.getClients().then( clients => {
      console.debug("this.mm.getClients() then returned " + JSON.stringify(clients))
      this.clients = clients
    })
  }

  mmChanged() {
    this.mm.getClients().then( clients => {
      console.debug("mmChanged then returned " + JSON.stringify(clients))
    })
  }

  attached() {
    console.debug("attached")
  }

  detached() {
    console.debug("detached")
  }

  addClient() {
    console.debug("addClient")
    this.newClient = new NewClientModel()
    this.newClient.url = ""
    this.newClient.addr = ""
    this.newClient.name = ""
    let me = this
    let promise = null
    $("#add_client_modal")
    .modal({
      onDeny    : function(){
        console.debug("canceled addClient")
      },
      onApprove : function() {
        console.debug(`onApprove:  + ${JSON.stringify(me.newClient)}`)
        if (me.newClient.rawUrl) {
          console.debug('adding client using raw url: ' + JSON.stringify(me.newClient.url))
          promise = me.mm.addClient(me.newClient.name, me.newClient.url, null, null)
        } else {
          console.debug(`adding client using addr: ${JSON.stringify(me.newClient.addr)} and port: ${me.newClient.port}`)
          promise = me.mm.addClient(me.newClient.name, null, me.newClient.addr, me.newClient.port)
        }
        // me.mm.addClient(me.newClient.name, me.newClient.url, me.newClient.addr, me.newClient.port).then ( addedClient => {
        promise.then ( addedClient => {
          console.debug('client added: ' + JSON.stringify(addedClient))
          me.newClient = null
        })
      },
      'inverted' : true
    })
    .modal('show')
    console.debug("after modal")
  }

  openClient(client) {
    this.router.navigateToRoute("broadcaster", {id:client.name})
  }

  delClient(client) {
    console.debug(`delClient: ${client.name}`)
    this.mm.delClient(client)
  }
}
