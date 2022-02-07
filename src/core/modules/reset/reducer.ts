import { LOGOUT_SUCCESS } from 'core/modules/auth/actions';
import { initialState } from 'core/modules/initialState';

export default function resetReducer(state: $TSFixMe, action: $TSFixMe) {
  switch (action.type) {
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        ...initialState,
      };
    }
    default:
      return state;
  }
}
