import alt from 'core/common/config/alt-config';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
class DummyActions {
  constructor() {
    this.generateActions('updateName');
  }
}

export default DummyActions;
