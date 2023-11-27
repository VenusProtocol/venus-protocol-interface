import { store } from '../../store';

export const getChainId = () => ({
  chainId: store.getState().chainId,
});
