import { HttpClient, json } from 'aurelia-fetch-client'
import { bindable, inject } from 'aurelia-framework'

let requestId = 0

@inject()
export class Snapcast {

  constructor() {
    this.httpClient = new HttpClient()
    this.httpClient.configure(config => {
      config
        .withDefaults({
          mode: 'cors',
          // credentials: 'Access-Control-Allow-Origin',
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json',
            // 'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        })
    })
  }

  getId(){
    return ++requestId
  }

  serverGetStatus() {
    let request = {
      id: `${this.getId()}`,
      jsonrpc: "2.0",
      method: "Server.GetRPCVersion"
    }

    console.debug(`requesting server.GetStatus: ${JSON.stringify(request)}`)

    this.httpClient
    .fetch('/api', {
      method: 'post',
      body: `${JSON.stringify(request)}`
    })
    .then(result => {
      console.log(`server got response: ${JSON.stringify(result)}`)
      JSON.stringify(result)
    })
    .then(serverStatus => {
      console.debug(`server returned response: ${serverStatus}`);
    })
    .catch(error => {
      console.debug(`Error requesting ServerGetStatus: ${error}`);
    });
  }

}
