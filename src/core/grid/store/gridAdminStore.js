import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';


import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import actions from 'core/grid/action/gridActions';

@createStore(alt)
export default class GridAdminStore {
  static displayName = 'GridAdminStore';

  constructor() {

    this.state = {
      editedGridConfig: null
    }

  }


}
