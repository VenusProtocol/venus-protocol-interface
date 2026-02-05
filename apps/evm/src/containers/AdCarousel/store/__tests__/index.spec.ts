import { store } from '..';

describe('store', () => {
  describe('doNotShowAdCarousel', () => {
    it('sets correct initial props', () => {
      expect(store.getState().doNotShowAdCarousel).toMatchInlineSnapshot('false');
    });
  });

  describe('hideAdCarousel', () => {
    it('updates props correctly', () => {
      store.getState().hideAdCarousel();

      expect(store.getState().doNotShowAdCarousel).toMatchInlineSnapshot('true');
    });
  });
});
