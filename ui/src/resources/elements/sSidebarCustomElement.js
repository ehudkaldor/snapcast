import {inject, bindable, customElement} from 'aurelia-framework';

@inject(Element)
@customElement('s-sidebar')
export class SSidebarCustomElement {

  @bindable context
  @bindable trigger

  constructor(element) {
    this.element = element
    console.debug("ctor")
  }

  bind() {

  }

  created() {
    $(this.element)
    .sidebar({
      context: $(this.context)
    })
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('attach events', this.trigger)
    console.debug("attached. this.element=" + JSON.stringify(this.element))
    console.debug("this.context=" + JSON.stringify(this.context))
    console.debug("this.trigger=" + JSON.stringify(this.trigger))
  }
}
