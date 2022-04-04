'use strict';
import * as util from './utils/util.js';
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
const Model = class extends Subject {
  constructor(isSingleTon) {
    super();
    return isSingleTon ? singleton.getInstance(this) : this;
  }
};
const HomeModel = class extends Model {
  constructor(isSingleTon) {
    super(isSingleTon);
  }
  async load(id = '') {
    const _list = await (
      await fetch(`https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/${id}`)
    ).json();
    util.prop(this, { _list });
  }
  get list() {
    return this._list;
  }
};

const Observer = class {
  observe() {}
};

const ViewModelObjserver = class extends Observer {
  constructor(_vm) {
    super();
    util.prop(this, { _vm });
  }
  observe(model) {
    this._vm.listen(model);
  }
};
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
const HomeVm = class extends ViewModel {
  base() {
    const model = new HomeModel(true);
    model.add(this.observer);
    model.notify();
  }
  listen(model) {
    if (!util.is(model, HomeModel)) util.err(`invalid model : ${model}`);
    this.notify(model.list);
  }
  async $direct(id) {
    if (!id) return;
    const homeModel = new HomeModel(true);
    await homeModel.load(id);
    homeModel.notify();
  }
};

const View = class extends Observer {
  constructor(isSingleTon, html) {
    super();
    return util.prop(isSingleTon ? singleton.getInstance(this) : this, { _view: html });
  }
  render() {
    util.override();
  }
  observe(v) {
    this.render(v);
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
const HomeView = class extends View {
  constructor(isSingleTon) {
    super(isSingleTon, util.el('div'));
    const breadCrumb = util.sel('.Breadcrumb');
    const nodes = util.sel('.Nodes');
    util.prop(this, { breadCrumb, nodes });
  }
  render(arr) {
    const { view, viewModel } = this;
    const template = document.createElement('template');
    const nodes = arr
      .map(
        (obj) => `
        <div class="Node" data-id=${obj.id}> 
            <div class="div-fas" style="pointer-events:none"><i class="fas fa-${
              obj.type === 'DIRECTORY' ? 'folder-open' : 'file-image'
            }"></i></div>
            <div style="pointer-events:none">${obj.name}</div>
        </div>`,
      )
      .join('');
    template.innerHTML = ` 
    <nav class="Breadcrumb">
        <div>root</div>
    </nav>
    <div class="Nodes">
    ${nodes}
    </div>
    `;
    util.append(util.el(view, 'innerHTML', ''), template.content);
    setTimeout(() => {
      util.sel('.Nodes').addEventListener('click', (e) => viewModel.$direct(e.target.dataset.id));
    }, 0);
  }
};

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
(async () => {
  await new HomeModel(true).load();
  app.add(
    'home',
    () => new HomeView(true),
    () => new HomeVm(true),
  );
  app.route('home');
})();
