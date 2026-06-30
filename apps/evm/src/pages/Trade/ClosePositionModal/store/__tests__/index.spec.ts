import { useStore } from '..';

describe('store', () => {
  beforeEach(() => {
    useStore.setState({
      isModalShown: false,
    });
  });

  describe('isModalShown', () => {
    it('sets correct initial props', () => {
      expect(useStore.getState().isModalShown).toMatchInlineSnapshot('false');
    });
  });

  describe('showModal', () => {
    it('updates props correctly', () => {
      useStore.getState().showModal();

      expect(useStore.getState().isModalShown).toMatchInlineSnapshot('true');
    });
  });

  describe('hideModal', () => {
    it('updates props correctly', () => {
      useStore.setState({
        isModalShown: true,
      });

      useStore.getState().hideModal();

      expect(useStore.getState().isModalShown).toMatchInlineSnapshot('false');
    });
  });
});
