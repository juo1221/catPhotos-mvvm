'use strict';
import * as util from './utils/util.js';

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
    util.prop(this, { _vm });
    vm.addView(this);
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
        <div>노란고양이</div>
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
const app = new App('.App');
app.add(
  'home',
  () => new HomeView(true),
  () => new HomeVm(true),
);
app.route('home');
