'use strict';
import * as util from './utils/util.js';
import './css/app.css';
import HomeModel from './mvvm/model/HomeModel.js';
import HomeView from './mvvm/view/HomeView.js';
import HomeVm from './mvvm/viewModel/HomeVm.js';

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
    view.viewModel = vm;
    vm[action](...arg);
    util.append(util.el(util.sel(this._parent), 'innerHTML', ''), view.view);
  }
};

const app = new App('.App');
const spinner = util.sel('.Loading');

(async () => {
  const homeModel = new HomeModel(true);
  await homeModel.load();
  spinner.classList.toggle('invisible');
  homeModel.cached();
  app.add(
    'home',
    () => new HomeView(true),
    () => new HomeVm(true),
  );
  app.route('home');
})();

export default spinner;
