import { useDisconnect } from 'wagmi';

export const useLogOut = () => {
  const { disconnectAsync } = useDisconnect();
  return disconnectAsync;
};
