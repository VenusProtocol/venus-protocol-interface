import { store } from '..';

describe('store', () => {
  describe('doNotShowPrimePromotionalBanner', () => {
    it('sets correct initial props', () => {
      expect(store.getState().doNotShowPrimePromotionalBanner).toMatchInlineSnapshot('false');
    });
  });

  describe('hidePrimePromotionalBanner', () => {
    it('updates props correctly', () => {
      store.getState().hidePrimePromotionalBanner();

      expect(store.getState().doNotShowPrimePromotionalBanner).toMatchInlineSnapshot('true');
    });
  });
});
