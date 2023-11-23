import { store } from '../../store';

export const getChainId = () => store.getState().chainId;
