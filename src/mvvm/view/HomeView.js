import * as util from '../../utils/util.js';
import View from '../view/View.js';

const HomeView = class extends View {
  constructor(isSingleTon) {
    super(isSingleTon, util.el('div'));
    const spinner = util.sel('.spinner');
  }
  render(arr, pathArr) {
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

    const path = pathArr.map((path) => `<div style="cursor:pointer">${path}</div>`).join('');

    template.innerHTML = ` 
        <nav class="Breadcrumb">
            <div style="cursor:pointer">root</div>
            ${path}
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
      util
        .sel('.Breadcrumb')
        .addEventListener(
          'click',
          (e) => e.currentTarget !== e.target && viewModel.$jump(e.target.innerHTML),
        );
    }, 0);
  }
};

export default HomeView;
