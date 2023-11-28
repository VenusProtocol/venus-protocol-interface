import { useGetPool } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useAccountAddress } from 'packages/wallet';

export const useGetCorePool = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
};
