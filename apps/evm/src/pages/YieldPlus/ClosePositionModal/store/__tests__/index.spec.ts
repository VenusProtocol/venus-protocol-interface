import { store } from '..';

describe('store', () => {
  beforeEach(() => {
    store.setState({
      isModalShown: false,
    });
  });

  describe('isModalShown', () => {
    it('sets correct initial props', () => {
      expect(store.getState().isModalShown).toMatchInlineSnapshot('false');
    });
  });

  describe('showModal', () => {
    it('updates props correctly', () => {
      store.getState().showModal();

      expect(store.getState().isModalShown).toMatchInlineSnapshot('true');
    });
  });

  describe('hideModal', () => {
    it('updates props correctly', () => {
      store.setState({
        isModalShown: true,
      });

      store.getState().hideModal();

      expect(store.getState().isModalShown).toMatchInlineSnapshot('false');
    });
  });
});
