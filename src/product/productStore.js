import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import {setProductAction} from 'product/productActions';



function productObject(state = null, action) {
  switch (action.type) {
    case setProductAction.type:
      return Object.assign({},action.payload);
    default:
      return state;
  }
}





export const product = combineReducers({
  productObject
});

