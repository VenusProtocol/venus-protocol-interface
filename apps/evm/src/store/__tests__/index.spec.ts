import { ChainId } from 'types';
import { store } from '..';

describe('store', () => {
  describe('userSettings', () => {
    it('sets correct initial user settings', () => {
      expect(store.getState().userSettings).toMatchSnapshot();
    });
  });

  describe('setUserSettings', () => {
    it('updates user settings correctly', () => {
      store.getState().setUserSettings({
        settings: {
          enableGaslessTransactions: false,
        },
      });

      expect(store.getState().userSettings).toMatchSnapshot();
    });

    it('updates user settings correctly when passing chainIds', () => {
      store.getState().setUserSettings({
        settings: {
          enableGaslessTransactions: false,
        },
        chainIds: [ChainId.BSC_TESTNET, ChainId.ARBITRUM_SEPOLIA],
      });

      expect(store.getState().userSettings).toMatchSnapshot();
    });
  });
});
