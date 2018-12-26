import {inject} from 'aurelia-framework';

@inject(Element)
export class SDropdownCustomAttribute {

  constructor(element) {
    this.element = element;
    console.debug("ctor")
  }

  attached() {
    $(this.element).dropdown();
  }
}
