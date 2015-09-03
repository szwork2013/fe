import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';


import Grid from 'core/grid/domain/grid';
import actions from 'core/grid/action/gridActions';

@createStore(alt)
export default class GridAdminStore {

  constructor() {

    this.state = {
      editedGridConfig: null
    };

  }

  @bind(actions.updateEditedGridConfig)
  updateEditedGridConfig(gridConfig) {
    console.debug("updateEditedGridConfig: ", gridConfig);
    this.setState({ editedGridConfig: gridConfig });
  }


}
