import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import {setInvoiceAction} from 'invoice/invoiceActions';



function invoiceObject(state = null, action) {
  switch (action.type) {
    case setInvoiceAction.type:
      return Object.assign({},action.payload);
    default:
      return state;
  }
}





export const invoice = combineReducers({
  invoiceObject
});

