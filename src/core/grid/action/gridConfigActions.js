import alt from 'core/common/config/alt-config';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
class GridConfigActions {

  updateGridConfigArray(entityKey, gridConfigArray) {
    return {entityKey, gridConfigArray};
  }

}

export default GridConfigActions;
