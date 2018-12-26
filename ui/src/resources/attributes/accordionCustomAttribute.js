import {inject} from 'aurelia-framework';

@inject(Element)
export class SAccordionCustomAttribute {

  constructor(element) {
    this.element = element;
    console.debug("ctor")
  }

  attached() {
    $(this.element).accordion();
  }
}
