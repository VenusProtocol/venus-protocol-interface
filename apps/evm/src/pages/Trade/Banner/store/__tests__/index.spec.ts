import { useStore } from '..';

describe('store', () => {
  describe('doNotShowBanner', () => {
    it('sets correct initial props', () => {
      expect(useStore.getState().doNotShowBanner).toMatchInlineSnapshot('false');
    });
  });

  describe('hideBanner', () => {
    it('updates props correctly', () => {
      useStore.getState().hideBanner();

      expect(useStore.getState().doNotShowBanner).toMatchInlineSnapshot('true');
    });
  });
});
