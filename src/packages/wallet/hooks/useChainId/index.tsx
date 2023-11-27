import { store } from 'packages/wallet/store';

export const useChainId = () => ({
  chainId: store.use.chainId(),
});
