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
  setList(_list) {
    util.prop(this, { _list });
  }
  get list() {
    return this._list;
  }
};
const BackModel = class extends Model {
  constructor(isSingleTon) {
    super(isSingleTon);
    if (!this._prevList) util.prop(this, { _prevList: [], _prevState: false });
  }
  save(homeModel) {
    if (!util.is(homeModel, HomeModel)) util.err(`invalid home model ${homeModel}`);
    this._prevList.push(homeModel.list);
  }
  load() {
    const target = this._prevList.pop();
    if (this._prevList.length === 0) util.prop(this, { _prevState: false });
    return target;
  }
  setState() {
    util.prop(this, { _prevState: true });
  }
  get state() {
    return this._prevState;
  }
  get list() {
    return this._prevList[this._prevList.length - 1];
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
  _state = false;
  base() {
    const model = new HomeModel(true);
    const Bmodel = new BackModel(true);
    model.add(this.observer);
    Bmodel.add(this.observer);
    model.notify();
  }
  listen(model) {
    switch (true) {
      case util.is(model, HomeModel):
        this.notify(model.list);
        break;
      case util.is(model, BackModel):
        const target = model.load();
        util.prop(this, { _state: model.state });
        this.notify(target);
        break;
    }
  }
  async $direct(id) {
    if (!id) return;
    const homeModel = new HomeModel(true);
    const backModel = new BackModel(true);
    backModel.save(homeModel);
    backModel.setState();
    util.prop(this, { _state: backModel.state });
    await homeModel.load(id);
    homeModel.notify();
  }
  $prev() {
    const homeModel = new HomeModel(true);
    const backModel = new BackModel(true);
    homeModel.setList(backModel.list);
    backModel.notify();
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
      <div class="Node  ${viewModel._state ? 'visible' : 'invisible'}">
        <div class="div-fas">
          <i class="fas fa-caret-left"></i>
        </div>
      </div>
    ${nodes}
    </div>
    `;
    util.append(util.el(view, 'innerHTML', ''), template.content);
    setTimeout(() => {
      util.sel('.Nodes').addEventListener('click', (e) => viewModel.$direct(e.target.dataset.id));
      util.sel('.div-fas').addEventListener('click', (e) => viewModel.$prev());
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
