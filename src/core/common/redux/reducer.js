import { combineReducers } from 'redux-immutablejs';

import {security} from 'core/security/securityStore';
import {metamodel} from 'core/metamodel/metamodelStore';
import {grid} from 'core/grid/gridStore';

import {party} from 'party/partyStore';
import {product} from 'product/productStore';
import {invoice} from 'invoice/invoiceStore';

const zauzooApp = combineReducers({
  metamodel,
  grid,
  security,
  party,
  invoice,
  product
});

export default zauzooApp;
