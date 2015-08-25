import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';


import MdEntity from 'core/metamodel/mdEntity';
import actions from 'core/metamodel/mdEntityActions';

@createStore(alt)
class MdEntityStore {

  constructor() {

    // [entityKey] -> MdEntity
    this.state = {
    };

  }

  static getEntity(entityKey) {
    return this.getState()[entityKey];
  }



  @bind(actions.updateEntity)
  updateEntity(entity) {
    console.debug("updateEntity: ", entity);
    this.setState({ [entity.id] : entity });
  }

  @bind(actions.updateEntities)
  updateEntities(entities) {
    console.debug("updateEntities: ", entities);
    this.setState(entities);
  }


}

export default MdEntityStore;
