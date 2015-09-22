import alt from 'core/common/config/alt-config';

import {createActions} from 'alt/utils/decorators';

@createActions(alt) class MdEntityActions {

  updateEntity(mdEntity) {
    return mdEntity;
  }

  updateEntities(mdEntities) {
    return mdEntities;
  }



}

export default MdEntityActions;
