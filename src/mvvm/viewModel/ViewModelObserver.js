import * as util from '../../utils/util.js';
import Observer from '../Observer.js';

const ViewModelObjserver = class extends Observer {
  constructor(_vm) {
    super();
    util.prop(this, { _vm });
  }
  observe(model) {
    this._vm.listen(model);
  }
};

export default ViewModelObjserver;
