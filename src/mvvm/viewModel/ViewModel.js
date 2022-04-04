import * as util from '../../utils/util.js';
import Subject from '../Subject.js';
import singleton from '../SingleTon.js';
import ViewModelObjserver from './ViewModelObserver.js';

const ViewModel = class extends Subject {
  constructor(isSingleTon) {
    super();
    const target = isSingleTon ? singleton.getInstance(this) : this;
    util.prop(this, { _observer: new ViewModelObjserver(target) });
    return target;
  }
  listen() {
    util.override();
  }
  get observer() {
    return this._observer;
  }
};

export default ViewModel;
