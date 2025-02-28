import { useAccount } from 'wagmi';

export const useAccountChainId = () => {
  const { chainId } = useAccount();
  return { chainId };
};
