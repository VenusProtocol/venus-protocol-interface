import { useGetPool, useGetSpokePools } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { useAccountAddress } from 'libs/wallet';
import { aggregateBorrowAssets } from '../aggregateBorrowAssets';

export const useBorrowAssets = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const { data: getSpokePoolsData, isLoading: isGetSpokePoolsLoading } = useGetSpokePools({
    accountAddress,
  });

  return {
    borrowAssets: aggregateBorrowAssets({
      assets: getPoolData?.pool.assets ?? [],
      spokePools: getSpokePoolsData?.spokePools ?? [],
    }),
    isLoading: isGetPoolLoading || isGetSpokePoolsLoading,
    isReady: !!getPoolData?.pool,
  };
};
