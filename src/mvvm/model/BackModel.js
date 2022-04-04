import * as util from '../../utils/util.js';
import Model from './Model.js';
import HomeModel from './HomeModel.js';

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
  savePath(path) {
    this._breadCrumb = [...path];
  }
  removeList(target) {
    if (!this._prevList.some((li, idx) => li === target && this._prevList.splice(idx)))
      util.err(`현재 위치 입니다. : ${target}`);
    if (!this._prevList.length) util.prop(this, { _prevState: false });
  }
  get state() {
    return this._prevState;
  }
  get list() {
    return this._prevList[this._prevList.length - 1];
  }
  get path() {
    return this._breadCrumb;
  }
};

export default BackModel;
