import * as util from '../../utils/util.js';
import HomeModel from '../model/HomeModel.js';

const ValidateHomeModel = class {
  #private;
  constructor(homeModel) {
    if (!util.is(homeModel, HomeModel)) util.err(`invalid homeModel : ${homeModel}`);
    const { list, path } = homeModel;
    if (!Array.isArray(list) || !list.length) util.err(`invalid list : ${list}`);
    list.forEach((li) => {
      const { id, name, type, filePath, parent } = li;
      if (typeof id !== 'string' || !id) util.err(`invalid id : ${id}`);
      if (typeof name !== 'string' || !name) util.err(`invalid name : ${name}`);
      if (typeof type !== 'string' || !type) util.err(`invalid type : ${type}`);
      if (filePath && typeof filePath !== 'string') util.err(`invalid filePath : ${filePath}`);
      if (parent && typeof parent.id !== 'string') util.err(`invalid parentID : ${parent.id}`);
    });
    if (!Array.isArray(path)) util.err(`invalid path : ${path}`);
    if (!path.every((pa) => typeof pa == 'string')) util.err(`invalid typeof path : ${path}`);
    this.#private = { list, path };
  }
  get datas() {
    return this.#private;
  }
};
export default ValidateHomeModel;
