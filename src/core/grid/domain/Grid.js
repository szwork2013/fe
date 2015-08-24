import _ from 'lodash';


export default class Grid {

  constructor (gridLocation, gridConfigs) {
    this.gridLocation = gridLocation;
    this.gridConfigs = gridConfigs;
  }


  /**
   * Vrati aktivni gridConfig, pokud je zadany gridId, zkousi hledat ten
   * @param gridId -nepovinny paramter
     */
  getActiveGridConfig(gridId) {
    let agc;
    if (gridId) {
      agc = this.gridConfigs.find(gc => gc.gridId == gridId);
    }

    if (!agc) {
      agc = _.first(this.gridConfigs.filter(gc => gc.defaultGrid));
    }

    if (!agc) {
      agc = _.first(this.gridConfigs);
    }

    return agc;
  }




}
