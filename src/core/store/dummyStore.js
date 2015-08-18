import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'core/action/dummyActions';

@createStore(alt)
class DummyStore {
  name = 'awesome';

  @bind(actions.updateName)
  updateName(name) {
    this.name = name;
  }
}

export default DummyStore;
