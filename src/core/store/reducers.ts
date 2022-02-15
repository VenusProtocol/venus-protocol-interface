import { combineReducers } from 'redux';
import { LOGOUT_SUCCESS } from 'core/modules/auth/actions';
import { account } from 'core/modules';
import { resetReducer } from 'core/modules/reset';

const appReducer = combineReducers({
  account,
});

export default function rootReducer(state: $TSFixMe, action: $TSFixMe) {
  let finalState = appReducer(state, action);
  if (action.type === LOGOUT_SUCCESS) {
    finalState = resetReducer(finalState, action);
  }
  return finalState;
}
