import fakeAccountAddress from '__mocks__/models/address';

import { store } from '..';

describe('store', () => {
  describe('hideModal', () => {
    it('adds an account address to the doNotShowAgainFor array', () => {
      expect(store.getState().doNotShowAgainFor).toEqual([]);

      store.getState().hideModal({ accountAddress: fakeAccountAddress });

      expect(store.getState().doNotShowAgainFor).toEqual([fakeAccountAddress]);
    });
  });
});
