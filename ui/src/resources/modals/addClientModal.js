import { bindable, inject } from 'aurelia-framework';
import { MultiMopidy } from 'services/multi-mopidy.js'
import * as $ from 'jquery';

@inject(MultiMopidy)
export class AddClientModal {
  // @bindable activity_word = "Add"
  @bindable client
  rawUrl = true

  constructor (multiMopidy) {
    this.mm = multiMopidy
  }

  attached() {
    console.debug(`attached. Client: ${JSON.stringify(this.client)}`)
    let raw =  ".radio.checkbox.raw"
    let friendly =  ".radio.checkbox.friendly"
    $(".raw").checkbox({
      onChecked: () => {
        this.client.rawUrl = true
        this.rawUrl = true
        console.debug(`set raw url. Client: ${JSON.stringify(this.client)}`)
      }
    })
    $(".friendly").checkbox({
      onChecked: () => {
        this.client.rawUrl = false
        this.rawUrl = false
        console.debug(`set friendly url. Client: ${JSON.stringify(this.client)}`)
      }
    })
    $(".addClientForm").form({
      fields: {
        port: {
          identifier  : 'port',
          rules: [
            {
              type   : 'integer[1..65500]',
              prompt : 'must be an integet between 1 and 65500'
            }
          ]
        },
        // addr: {
        //   identifier  : 'addr',
        //   rules: [
        //     {
        //       type   : '',
              // prompt : 'must be a valid url or ip address'
        //     }
        //   ]
        // },
        // url: {
        //   identifier  : 'url',
        //   rules: [
        //     {
              // type   : 'regex[ws://.*):(\d*)\/?(.*)]',
              // prompt : 'must be avalid WS url or ip address'
        //     }
        //   ]
        // }
      },
      inline : true,
      on     : 'blur'
    })
  }

  created () {
    console.log("created");
  }

  addClient() {

  }
}
