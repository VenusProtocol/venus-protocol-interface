import { useAccount } from 'wagmi';

import useGetIsAddressAuthorized from 'clients/api/queries/getIsAddressAuthorized/useGetIsAddressAuthorized';

export const useAccountAddress = () => {
  const { address, isConnected } = useAccount();

  const { data: accountAuth } = useGetIsAddressAuthorized(address || '', {
    enabled: address !== undefined,
  });

  const isAuthorizedAddress = !accountAuth || accountAuth.authorized;
  const accountAddress = !!address && isAuthorizedAddress && isConnected ? address : undefined;

  return accountAddress;
};
