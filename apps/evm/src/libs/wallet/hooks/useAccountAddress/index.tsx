import { useAccount } from 'wagmi';

export const useAccountAddress = () => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();

  const accountAddress = !!address && isConnected ? address : undefined;

  return { accountAddress, isAccountPending: isConnecting || isReconnecting };
};
