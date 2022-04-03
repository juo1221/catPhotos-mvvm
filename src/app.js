'use strict';
import * as util from './utils/util.js';

const homeView = class {};
const homeVm = class {};

const App = class extends Map {
  constructor(_parent) {
    super();
    util.prop(this, { _parent });
  }
  add(path, view, vm) {
    super.set(path, [view, vm]);
  }
  route(path, ...arg) {
    const [p, action = 'base'] = [path];
    const [view, vm] = super.get(p).map((f) => f());
    view._homeVm = vm;
    vm[action](...arg);
    util.append(util.el(util.sel(this._parent), 'innerHTML', ''), view.view);
  }
};
const app = new App('.App');
app.add(
  'home',
  () => new homeView(true),
  () => new homeVm(true),
);
app.route('home');
