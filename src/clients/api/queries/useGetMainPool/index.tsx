import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { getContractAddress } from 'utilities';

import { useGetMainAssets } from 'clients/api';

export interface UseGetMainPoolInput {
  accountAddress?: string;
}

export interface UseGetMainPoolOutput {
  isLoading: boolean;
  data?: {
    pool: Pool;
  };
}

const mainPoolComptrollerAddress = getContractAddress('comptroller');

const useGetMainPool = ({ accountAddress }: UseGetMainPoolInput): UseGetMainPoolOutput => {
  const { data: getMainAssetsData, isLoading: isGetMainAssetsDataLoading } = useGetMainAssets({
    accountAddress,
  });

  const { t } = useTranslation();

  const pool: Pool | undefined = useMemo(
    () =>
      getMainAssetsData?.assets && {
        comptrollerAddress: mainPoolComptrollerAddress,
        name: t('mainPool.name'),
        description: t('mainPool.description'),
        isIsolated: false,
        assets: getMainAssetsData.assets,
        userSupplyBalanceCents: getMainAssetsData.userTotalSupplyBalanceCents,
        userBorrowBalanceCents: getMainAssetsData.userTotalBorrowBalanceCents,
        userBorrowLimitCents: getMainAssetsData.userTotalBorrowLimitCents,
      },
    [getMainAssetsData?.assets],
  );

  return { isLoading: isGetMainAssetsDataLoading, data: pool && { pool } };
};

export default useGetMainPool;
