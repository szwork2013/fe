import {Map} from 'immutable';
import { combineReducers } from 'redux-immutablejs';


import {updateEntitiesAction} from 'core/metamodel/metamodelActions';



function entities(state = new Map(), action) {
  switch (action.type) {
    case updateEntitiesAction.type:
      return state.merge(action.payload);
    default:
      return state;
  }
}



export const metamodel = combineReducers({
  entities
});

