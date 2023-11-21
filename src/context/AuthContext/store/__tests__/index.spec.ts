import { chains } from 'packages/wallet';
import { ChainId } from 'types';

import { store } from '..';

describe('store', () => {
  describe('chainId', () => {
    it('corresponds to the ID of the first chain in the list of supported chains', () => {
      expect(store.getState().chainId).toBe(chains[0].id);
    });
  });

  describe('setChainId', () => {
    it('sets the chainId property correctly', () => {
      // Add notification
      store.getState().setChainId({
        chainId: ChainId.SEPOLIA,
      });

      expect(store.getState().chainId).toBe(ChainId.SEPOLIA);
    });
  });
});
