import { useAccountAddress } from 'packages/wallet';

import { useGetPool } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

export const useGetCorePool = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
};
