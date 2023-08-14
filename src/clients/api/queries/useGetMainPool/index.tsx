import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';

import { useGetMainAssets } from 'clients/api';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

export interface UseGetMainPoolInput {
  accountAddress?: string;
}

export interface UseGetMainPoolOutput {
  isLoading: boolean;
  data?: {
    pool: Pool;
  };
}

const useGetMainPool = ({ accountAddress }: UseGetMainPoolInput): UseGetMainPoolOutput => {
  const { data: getMainAssetsData, isLoading: isGetMainAssetsDataLoading } = useGetMainAssets({
    accountAddress,
  });

  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

  const { t } = useTranslation();

  const pool: Pool | undefined = useMemo(
    () =>
      getMainAssetsData?.assets && mainPoolComptrollerContractAddress
        ? {
            comptrollerAddress: mainPoolComptrollerContractAddress,
            name: t('mainPool.name'),
            description: t('mainPool.description'),
            isIsolated: false,
            assets: getMainAssetsData.assets,
            userSupplyBalanceCents: getMainAssetsData.userTotalSupplyBalanceCents,
            userBorrowBalanceCents: getMainAssetsData.userTotalBorrowBalanceCents,
            userBorrowLimitCents: getMainAssetsData.userTotalBorrowLimitCents,
          }
        : undefined,
    [getMainAssetsData?.assets, mainPoolComptrollerContractAddress],
  );

  return { isLoading: isGetMainAssetsDataLoading, data: pool && { pool } };
};

export default useGetMainPool;
