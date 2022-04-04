import * as util from '../../utils/util.js';
import Observer from '../Observer.js';
import singleton from '../SingleTon.js';

const View = class extends Observer {
  constructor(isSingleTon, html) {
    super();
    return util.prop(isSingleTon ? singleton.getInstance(this) : this, { _view: html });
  }
  render() {
    util.override();
  }
  observe(...v) {
    this.render(...v);
  }
  get view() {
    return this._view;
  }
  get viewModel() {
    return this._vm;
  }
  set viewModel(_vm) {
    util.prop(this, { _vm });
    _vm.add(this);
  }
};

export default View;
