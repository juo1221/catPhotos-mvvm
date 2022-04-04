import * as util from '../utils/util.js';
import Observer from './Observer.js';

const Subject = class extends Set {
  add(obj) {
    if (!util.is(obj, Observer)) util.err(`invalid obj : ${obj}`);
    super.add(obj);
  }
  has(obj) {
    if (!util.is(obj, Observer)) util.err(`invalid obj : ${obj}`);
    return super.has(obj);
  }
  delete(obj) {
    if (!util.is(obj, Observer)) util.err(`invalid obj : ${obj}`);
    super.delete(obj);
  }
  notify(...arg) {
    this.forEach((observer) => (arg.length ? observer.observe(...arg) : observer.observe(this)));
  }
};

export default Subject;
