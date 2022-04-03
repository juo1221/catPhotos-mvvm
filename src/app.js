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
    this.forEach((observer) => (arg.length ? observer.observe(arg) : observer.observe(this)));
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
const View = class extends Observer {
  constructor(html) {
    super();
    util.prop(this, { _view: html });
  }
  render() {
    util.override();
  }
  observe() {
    this.render();
  }
  get view() {
    return this._view;
  }
  get viewModel() {
    return this._vm;
  }
  set viewModel(_vm) {
    console.log(_vm);
    util.prop(this, { _vm });
    _vm.addView(this);
  }
};
const HomeView = class extends View {
  constructor() {
    super(document.createDocumentFragment());
    const breadCrumb = util.sel('.Breadcrumb');
    const nodes = util.sel('.Nodes');
    util.prop(this, { breadCrumb, nodes });
  }
  render() {
    const arr = [{ name: 'kim' }, { name: 'kim2' }, { name: 'kim3' }];
    const { view } = this;
    const template = document.createElement('template');
    const nodes = arr
      .map(
        (obj) => `
        <div class="Node"> 
            <div class="div-fas"><i class="fas fa-folder-open"></i></div>
            <div>2021/04</div>
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
    view.appendChild(template.content);
    setTimeout(() => {
      util.sel('.Nodes').addEventListener('click', () => console.log(1));
    }, 0);
  }
};
const HomeVm = class {
  base() {}
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
    view._homeVm = vm;
    vm[action](...arg);
    view.render();
    util.append(util.el(util.sel(this._parent), 'innerHTML', ''), view.view);
  }
};
(async () => {
  const app = new App('.App');
  app.add(
    'home',
    () => new HomeView(true),
    () => new HomeVm(true),
  );
  app.route('home');
  //   const home = new HomeModel(true);
  //   await home.load();
  //   console.log(home.list);
})();
