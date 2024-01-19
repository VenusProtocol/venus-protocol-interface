import { useDisconnect } from 'wagmi';

export const useLogOut = () => {
  const { disconnectAsync: logOut } = useDisconnect();
  return { logOut };
};
