import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';

import actions from 'core/grid/action/gridConfigActions';

@createStore(alt)
class GridConfigStore {

  constructor() {

    this.state = {
      // [entityKey] -> gridConfig[]
      gridConfigs: {}
    };

  }

  /**
   * Vrati pole gridConfigu pro danou entitu
   * @param entityKey
   * @param route - nepovinny parametr
   * @returns {*}
     */
  static getGridConfig(entityKey, route) {
    let gridConfigArray = this.getState().gridConfigs[entityKey];
    if (gridConfigArray) {
      return (route) ? gridConfigArray.filter(g => (!g.pageToShow || g.pageToShow === route)) : gridConfigArray;
    } else {
      return gridConfigArray;
    }
  }

  /**
   * Vrati defaultni gridConfig pro danou entitu nebo undefined
   * @param entityKey
   * @param route - nepovinny parametr
   * @returns {*}
     */
  static getDefaultGridConfig(entityKey, route) {
    let gcArray = this.getGridConfig(entityKey, route);
    if (!gcArray) return null;

    let defaultGc = gcArray.filter(g => g.defaultGrid).shift();

    // neni-li zadny defaultni vratim prvni
    if (!defaultGc) {
      defaultGc = gcArray.shift();
    }

    return defaultGc;
  }


  @bind(actions.updateGridConfigArray)
  updateGridConfigArray(obj) {
    const { entityKey, gridConfigArray } = obj;
    const gcs = Object.assign({}, this.state.gridConfigs);
    gcs[entityKey] = gridConfigArray;
    this.setState({ gridConfigs : gcs });
  }



}

export default GridConfigStore;
