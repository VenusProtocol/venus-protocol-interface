import { zeroXApiUrl } from 'constants/swap';
import { useChainId } from 'libs/wallet';

export const useZeroXApiUrl = () => {
  const { chainId } = useChainId();
  return chainId in zeroXApiUrl ? zeroXApiUrl[chainId as keyof typeof zeroXApiUrl] : undefined;
};
