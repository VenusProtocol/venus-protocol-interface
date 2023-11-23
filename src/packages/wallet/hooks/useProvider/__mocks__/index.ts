import { getDefaultProvider } from 'ethers';

const defaultProvider = getDefaultProvider();
export const useProvider = () => defaultProvider;
