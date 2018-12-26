import { inject, bindable, customElement, bindingMode } from 'aurelia-framework';

@inject(Element)
@customElement('s-range')
export class SRangeCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) label;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) labeled;
  @bindable value
  @bindable total
  @bindable color
  @bindable inverted
  @bindable hover_text
  @bindable callback = null

  constructor(element) {
    this.element = element;
  }
  bind() {

    // since we told aurelia that these properties are bindable, the binding
    // system has already given values to these properties if available, so
    // we pull from the html attribute if those values are not set
    this.labeled = this.labeled || this.element.hasAttribute('labeled');
    this.label = this.label || this.element.getAttribute('label');
    this.value = this.value || this.element.getAttribute('value');
    this.total = this.total || this.element.getAttribute('total');
  }

  attached() {
    console.debug("SRangeCustomElement")

    if (this.callback != null) {
      $(this.element).range({
        min: 0,
        max: this.total,
        start: this.value,
        onChange: (val) => {
          console.debug(`value of range changed to ${val}`)
          this.callback({val: val})
        }
      })
    } else {

    }
  }

  valueChanged(newValue, oldValue) {
    if (this.total != null) {
      let val = newValue * 100 / this.total
      $(this.element).range('set value', val)
    } else {
      $(this.element).range('set value', newValue)
    }
    console.debug("range. total is " + this.total + ", value is " + this.value)
  }
}
