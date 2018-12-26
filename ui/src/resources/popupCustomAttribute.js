import { inject, bindable } from 'aurelia-framework';

@inject(Element)
export class SPopupCustomAttribute {

  @bindable content

  constructor(element) {
    this.element = element;
    console.debug("ctor")
  }

  attached() {
    $(this.element).popup({
      title : this.content,
      content : this.content
    });
  }
}
