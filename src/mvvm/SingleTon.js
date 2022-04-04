const SingleTon = class extends WeakMap {
  get() {
    util.err('disable');
  }
  set() {
    util.err('disable');
  }
  has() {
    util.err('disable');
  }
  delete() {
    util.err('disable');
  }
  getInstance(v) {
    if (!super.has(v.constructor)) super.set(v.constructor, v);
    return super.get(v.constructor);
  }
};
const singleton = new SingleTon();

export default singleton;
