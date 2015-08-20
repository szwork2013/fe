import Axios from 'core/common/config/axios-config';
import When from 'when';

import ServiceAncestor from 'core/common/service/serviceAncestor';
import GridConfigStore from 'core/grid/store/gridConfigStore';
import GridConfigActions from 'core/grid/action/gridConfigActions';

class GridService extends ServiceAncestor {


  /**
   * Vrati pole GridConfig pro dany entityKey a pripadne route
   * Podiva se do GridConfigStore jestli bylo inicializovano pro dany entityKey a pokud ano, vrati toto pole jako promise
   * Pokud nebylo, udela api call a pres akci updatne store a vrati pole (jako promise samozrejme)
   * @param entityKey
   * @param route
   * @returns {*}
     */
  getGridConfigs(entityKey, route) {

    let gcArray = GridConfigStore.getGridConfig(entityKey, route);
    if (gcArray) {
      console.debug("GridService#getGridConfigs(%s, %s) - from store (sync)", entityKey, route);
      return When(gcArray);
    } else {
      console.debug("GridService#getGridConfigs(%s, %s) - from server (async)", entityKey, route);
      return Axios.get(this.api('/core/grid-config/' + entityKey)).then((response) => {
        gcArray = response.data;
        GridConfigActions.updateGridConfigArray(entityKey, gcArray);
        return (route) ? gcArray.filter(g => (!g.pageToShow || g.pageToShow === route)) : gcArray;
      });
    }

  }



}

export default new GridService();

