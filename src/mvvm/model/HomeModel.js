import * as util from '../../utils/util.js';
import Model from './Model.js';

const HomeModel = class extends Model {
  constructor(isSingleTon) {
    super(isSingleTon);
    if (!this._cachedList) util.prop(this, { _cachedList: new Map() });
    if (!this._breadCrumb) util.prop(this, { _breadCrumb: [] });
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
  cached(key = 'root') {
    this._cachedList.set(key, this._list);
  }
  loadCached(name) {
    util.prop(this, { _list: this.cachedList.get(name) });
  }
  savePath(_path) {
    this._breadCrumb.push(_path);
  }
  removePath() {
    this._breadCrumb.pop();
  }
  jumpTo(path) {
    if (!this._breadCrumb.some((p, idx) => p === path && this._breadCrumb.splice(idx + 1))) {
      this._breadCrumb.splice(0);
    }
  }
  get path() {
    return this._breadCrumb;
  }
  get list() {
    return this._list;
  }
  get(id) {
    let res;
    this._list.some((li) => {
      if (li.id === id) {
        res = li;
        return true;
      }
    });
    return res;
  }
  get cachedList() {
    return this._cachedList;
  }
};

export default HomeModel;
