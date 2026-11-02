import { useGetPool, useGetSpokePools } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import { aggregateBorrowAssets } from '../aggregateBorrowAssets';

export const useBorrowAssets = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();
  const isSpokeEnabled = useIsFeatureEnabled({ name: 'spoke' });

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
    isReady: !!getPoolData?.pool && (!isSpokeEnabled || !!getSpokePoolsData),
  };
};
