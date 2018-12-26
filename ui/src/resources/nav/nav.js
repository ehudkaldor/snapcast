import { bindable } from 'aurelia-framework';

export class Nav {
  @bindable router;

  attached() {
    // $('.ui.sticky').sticky({
    //   context: '#navrow'
    // })
  }
}
