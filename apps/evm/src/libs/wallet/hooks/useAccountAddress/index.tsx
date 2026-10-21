import { useAccount } from 'wagmi';

export const useAccountAddress = () => {
  const { address, isConnected } = useAccount();

  const accountAddress = !!address && isConnected ? address : undefined;

  return { accountAddress };
};
