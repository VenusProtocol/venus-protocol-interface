import { store } from 'packages/wallet/store';

export const useChainId = () => store.use.chainId();
