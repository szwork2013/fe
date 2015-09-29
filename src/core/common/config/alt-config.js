import Alt from 'alt';
import {stringify} from 'core/common/utils/jsonUtils';

console.debug('alt init');

const alt = new Alt({
  serialize: stringify
});

export default alt;
