import { Setting } from 'types';

export interface State {
  account: {
    setting: Setting;
  };
  auth: {
    user: $TSFixMe;
  };
}

const account = {
  setting: {
    marketType: 'supply',
    pendingInfo: {
      type: '',
      status: false,
      amount: '0',
      symbol: '',
    },
    vaultVaiStaked: null,
    withXVS: true,
  },
};

export const initialState: State = {
  account,
  auth: {
    user: null,
  },
};
