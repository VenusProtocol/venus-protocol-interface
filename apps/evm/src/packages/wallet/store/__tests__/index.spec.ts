import { store } from '..';

describe('store', () => {
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
