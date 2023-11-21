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
      store.getState().setChainId({
        chainId: ChainId.SEPOLIA,
      });

      expect(store.getState().chainId).toBe(ChainId.SEPOLIA);
    });
  });

  describe('isAuthModalOpen', () => {
    it('is false on initialization', () => {
      expect(store.getState().isAuthModalOpen).toBe(false);
    });
  });

  describe('setIsAuthModalOpen', () => {
    it('sets the isAuthModalOpen property correctly', () => {
      store.getState().setIsAuthModalOpen({
        isAuthModalOpen: true,
      });

      expect(store.getState().isAuthModalOpen).toBe(true);
    });
  });
});
