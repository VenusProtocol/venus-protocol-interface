import { LOGIN_SUCCESS, REGISTER_SUCCESS } from 'core/modules/auth/actions';
import { initialState } from 'core/modules/initialState';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type '{ account:... Remove this comment to see the full error message
export default function auth(state = initialState.auth, action = {}) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type '{}'.
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: payload.user,
      };
    }
    case REGISTER_SUCCESS: {
      return {
        ...state,
        user: payload.user,
      };
    }
    default: {
      return state;
    }
  }
}
