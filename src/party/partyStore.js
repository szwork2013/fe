import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import {setPartyAction} from 'party/partyActions';



function partyObject(state = null, action) {
  switch (action.type) {
    case setPartyAction.type:
      console.log('setPartyAction = ', action);
      return Object.assign({},action.payload);
    default:
      return state;
  }
}





export const party = combineReducers({
  partyObject
});

