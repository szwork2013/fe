import { createAction, createPromiseAction } from 'core/common/redux/actions';
import Axios from 'core/common/config/axios-config';

export const setPartyAction = createAction('PARTY_SET_PARTY');


// payload = grid
export const updateGridAction = createAction('PARTY_UPDATE_GRID');
