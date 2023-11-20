import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

export const useGetCorePool = () => {
  const { accountAddress } = useAuth();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
};
