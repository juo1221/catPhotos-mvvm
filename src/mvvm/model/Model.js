import singleton from '../SingleTon.js';
import Subject from '../Subject.js';

const Model = class extends Subject {
  constructor(isSingleTon) {
    super();
    return isSingleTon ? singleton.getInstance(this) : this;
  }
};

export default Model;
