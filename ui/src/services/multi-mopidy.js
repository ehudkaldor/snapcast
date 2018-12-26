import { Factory, inject } from 'aurelia-framework';
import { MopidyClient } from './mopidy-client.js'

let latency = 200;
let lastId = 0

@inject(Factory.of(MopidyClient))
export class MultiMopidy {

  clients = []

  getId() {
    return ++lastId
  }

  constructor(mopidyFactory) {
    // let me = new MopidyClient("ws://127.0.0.1:6680/mopidy/ws/")
    console.debug("created MultiMop: " + JSON.stringify(this.clients))
    this.mopidyFactory = mopidyFactory
    let tempClients = localStorage.getItem("clients")
    console.debug(`raw read from localStorage: ${tempClients}`)
    if (tempClients !== null) {
      JSON.parse(tempClients).forEach( entry => {
        console.debug(`connecting client ${JSON.stringify(entry)}`)
        this.clients.push(this.mopidyFactory(entry))
        // this.clients.push(Object.assign(new MopidyClient(), entry))
      })
      // this.clients = JSON.parse(tempClients)
    } else {
      this.clients = []
    }
    // this.clients.map( c => {
    //   console.debug(`connecting client ${JSON.stringify(c)}`)
    //   Object.assign(new MopidyClient(), JSON.stringify(c))
    // })
    // this.addClient("localhost", "ws://localhost:6680/mopidy/ws/", "localhost", 6680).then( x =>
    //   console.debug("ctor after adding. multimop: " + JSON.stringify(this))
    // )
    // this.addClient("worker-pi3", "ws://worker-pi3.local:6680/mopidy/ws/", "worker-pi3.local", 6680).then( x =>
    //   console.debug("ctor after adding. multimop: " + JSON.stringify(this))
    // )

  }

  async getClients() {
    console.debug("getClients called")
    this.isRequesting = true
    return new Promise(resolve => {
      setTimeout(() => {
        this.isRequesting = false
        resolve(this.clients)
      }, latency)
    })
  }

  exists(params) {
    // console.debug(`params: ${JSON.stringify(params)}, client: ${JSON.stringify(this.url)}`)
    console.debug(`params: ${JSON.stringify(params)}`)
    if ((params.url && params.url.trim() === this.url.trim()) ||
      (params.addr != "" && "ws://" + params.addr.trim() + ":" + params.port + "/mopidy/ws" === this.url.trim())
    ) {
      console.debug("checkParams returning true")
      return true
    }
    else {
      console.debug("checkParams returning false")
      return false
    }
  }

  breakUrl(url, params){
    let slashSlashIndex = url.indexOf("//")
    console.debug(`breakUrl: indexOf('/'): ${slashSlashIndex}`)
    let collon = url.indexOf(":", slashSlashIndex+1)
    console.debug(`breakUrl: indexOf(':'): ${collon}`)
    params.addr = url.substring(slashSlashIndex+2, collon)
    params.port = url.substring(collon+1, url.indexOf('/', collon))
    console.debug(`breakUrl: address: ${this.addr}`)
    console.debug(`breakUrl: port: ${this.port}`)
  }


  addClient(name, url, addr, port) {
    console.debug(`addClient called with URL ${url}, name: ${name}, addr: ${addr}, port: ${port}`)
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let params = new Object()
        params.name = (name === "undefined" ? "Nameless" : name)
        // params.name = name
        if (url) {
          this.breakUrl(url, params)
          console.debug(`adding client by url ${url} with params: ${JSON.stringify(params)}`)
        } else {
          if (addr && port > 0) {
            params.addr = addr
            params.port = port
            console.debug(`adding client by addr:port ${params.addr}:${params.port} with params: ${JSON.stringify(params)}`)
          } else {
            console.error(`could not add client with name: ${name}, url: ${url}, addr: ${addr}, port: ${port}`)
            return
          }
        }
        // params.url = url != null ? url : ""
        // params.addr = addr != null ? addr : ""
        // params.port = port > 0 ? port : 6680
        // let found = this.clients.filter(x => x.checkParams(params))[0]
        let found = this.clients.filter(x => x.params.addr === params.addr && x.params.port === params.port)[0]
        let instance

        if (found) {
          console.debug("client already exists")
          let index = this.clients.indexOf(found);
          instance = found;
        } else {
          console.debug("adding client")
          params.id = this.getId()
          instance = this.mopidyFactory(params)
          // instance.id = this.getId()
          let existing = localStorage.getItem("clients")
          if (existing !== null) {
            existing = JSON.parse(existing)
            console.debug(`read clients from localStorage: ${JSON.stringify(existing)}`)
          } else {
            existing = []
            console.debug(`no clients found in localStorage`)
          }
          // let entry = {
          //   "id": instance.id,
          //   "name": instance.name,
          //   "addr": instance.addr,
          //   "port": instance.port
          // }
          console.debug(`adding ${JSON.stringify(params)} to clients localStorage`)
          this.clients.push(instance)
          existing.push(params)
          localStorage.setItem("clients", JSON.stringify(existing))
        }
        this.isRequesting = false
        console.debug("this.clients: " + JSON.stringify(this.clients))
        resolve(instance)
      }, latency)
    })
  }

  delClient(client) {
    console.debug("delClient called for client " + JSON.stringify(client.name))
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = this.clients.filter(x => x == client)[0]
        let instance = found

        if (found) {
          console.debug("client found, deleting")
          let index = this.clients.indexOf(found)
          this.clients.splice(index, 1)
          let storedClients = JSON.parse(localStorage.getItem("clients"))
          console.debug(`storedClients before filter: ${storedClients}`)
          storedClients = storedClients.filter(params => {
            console.debug(`delClient storedClients: compating ${JSON.stringify(params)} to ${JSON.stringify(found.params)}`)
            return params.addr !== found.params.addr || params.port !== found.params.port
          })
          console.debug(`storedClients after filter: ${storedClients}`)
          localStorage.setItem("clients", JSON.stringify(storedClients))
          instance = found
        } else {
          console.debug("adding not found, failing silently")
          instance = null
        }
        this.isRequesting = false
        console.debug("this.clients: " + JSON.stringify(this.clients))
        resolve(instance)
      }, latency)
    })
  }
}
