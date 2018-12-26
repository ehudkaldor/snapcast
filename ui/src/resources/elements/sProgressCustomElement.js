import { inject, bindable, customElement, bindingMode } from 'aurelia-framework';
import * as $ from 'jquery';

// this is how to import jquery and semantic-ui, which we will be using
// in our progress bar custom element
// import $ from 'jquery';
// import 'semantic-ui';

@inject(Element)

// this tells Aurelia what the tag name of the custom element will be;
// we can omit the decorator if our class name matches the convention
// TagNameCustomElement
@customElement('s-progress')

// while custom element class names are expected to be init capped, their
// respective custom element will be lower case hyphenated; our custom
// element below translates to the <s-progress> tag
export class SProgressCustomElement {

  // we can define an optimal default binding mode for attributes that
  // are designed to be bound only once (oneTime) or only from the
  // viewModel (oneWay)
  @bindable({ defaultBindingMode: bindingMode.oneTime }) label;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) labeled;
  @bindable progress
  @bindable total
  @bindable hover_text
  @bindable color
  @bindable size
  @bindable label
  @bindable labeled

  constructor(element) {
    this.element = element;
  }

  // here we enable both aurelia binding and standard HTML attributes, so
  // we can use both syntaxes, for example <s-progress labeled> or
  // <s-progress labeled.bind="showLabel">
  bind() {

    // since we told aurelia that these properties are bindable, the binding
    // system has already given values to these properties if available, so
    // we pull from the html attribute if those values are not set
    this.labeled = this.labeled || this.element.hasAttribute('labeled');
    this.label = this.label || this.element.getAttribute('label');
    this.progress = this.progress || this.element.getAttribute('progress');
    this.total = this.total || this.element.getAttribute('total');
  }

  // this lifecycle callback is called when the element is in the DOM
  // and ready for manipulation, and so this is where we call all the
  // semantic-ui code on the element
  attached() {
    $(this.element).progress({
      text: {
        active: this.label
      }
    });
  }

  // AFAIK, semantic-ui doesn't have / need teardown functions; however,
  // some frameworks do, and this is where you would call them
  detached() { }

  // by convention, we can listen and respond to changes in any bindable
  // property by creating a callback function called {attribute}Changed,
  // and we can use this function to call the semantic-ui api
  progressChanged(newValue) {
    if (this.total != null) {
      let val = newValue * 100 / this.total
      $(this.element).progress('set percent', val)
    } else {
      $(this.element).progress('set progress', newValue)
    }
    // console.debug("progress. total is " + this.total + ", progress is " + this.progress)

  }
}
