import * as util from '../../utils/util.js';
import ViewModel from './ViewModel.js';
import HomeModel from '../model/HomeModel.js';
import BackModel from '../model/BackModel.js';
import spinner from '../../app.js';

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
        this.notify(model.list, model.path);
        break;
      case util.is(model, BackModel):
        const target = model.load();
        util.prop(this, { _state: model.state });
        this.notify(target, model.path);
        break;
    }
  }
  async $direct(id) {
    if (!id) return;
    try {
      const homeModel = new HomeModel(true);
      const backModel = new BackModel(true);
      const target = homeModel.get(id);
      if (target.type === 'DIRECTORY') {
        backModel.save(homeModel);
        backModel.savePath(homeModel.path);
        backModel.setState();
        util.prop(this, { _state: backModel.state });
        if (homeModel.cachedList.has(target.name)) {
          homeModel.loadCached(target.name);
        } else {
          spinner.classList.toggle('invisible');
          await homeModel.load(id);
          spinner.classList.toggle('invisible');
          homeModel.cached(target.name);
        }
        homeModel.savePath(target.name);
        homeModel.notify();
      } else {
        window.open(
          `https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public${target.filePath}`,
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  $prev() {
    const homeModel = new HomeModel(true);
    const backModel = new BackModel(true);
    homeModel.setList(backModel.list);
    homeModel.removePath();
    backModel.savePath(homeModel.path);
    backModel.notify();
  }
  $jump(path) {
    try {
      const homeModel = new HomeModel(true);
      const backModel = new BackModel(true);
      if (!homeModel.cachedList.has(path)) err(`invalid path:${path}`);
      const target = homeModel.cachedList.get(path);
      homeModel.setList(target);
      homeModel.jumpTo(path);
      backModel.removeList(target);
      util.prop(this, { _state: backModel.state });
      homeModel.notify();
    } catch (err) {
      console.log(err.message);
    }
  }
};

export default HomeVm;
