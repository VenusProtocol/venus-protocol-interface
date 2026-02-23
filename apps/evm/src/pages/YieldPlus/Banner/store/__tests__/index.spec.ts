import { store } from '..';

describe('store', () => {
  describe('doNotShowBanner', () => {
    it('sets correct initial props', () => {
      expect(store.getState().doNotShowBanner).toMatchInlineSnapshot('false');
    });
  });

  describe('hideBanner', () => {
    it('updates props correctly', () => {
      store.getState().hideBanner();

      expect(store.getState().doNotShowBanner).toMatchInlineSnapshot('true');
    });
  });
});
