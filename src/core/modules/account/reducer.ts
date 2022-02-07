import { SET_SETTING_REQUEST } from 'core/modules/account/actions';
import { initialState } from 'core/modules/initialState';

export default function account(state = initialState.account, action = {}) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type '{}'.
  const { type, payload } = action;
  switch (type) {
    case SET_SETTING_REQUEST: {
      return {
        ...state,
        setting: {
          ...state.setting,
          ...payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}
