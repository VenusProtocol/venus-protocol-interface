import BigNumber from 'bignumber.js';
import { ApyChartProps } from 'components';
import React from 'react';
import { VToken } from 'types';
import { formatPercentage } from 'utilities';

import { useGetMarketHistory } from 'clients/api';

const useGetChartData = ({ vToken }: { vToken: VToken }) => {
  const {
    isLoading,
    data: marketSnapshotsData = {
      marketSnapshots: [],
    },
  } = useGetMarketHistory({
    vToken,
  });

  return React.useMemo(() => {
    const supplyChartData: ApyChartProps['data'] = [];
    const borrowChartData: ApyChartProps['data'] = [];

    [...marketSnapshotsData.marketSnapshots]
      // Snapshots are already reversed, due to the negative slice
      .forEach(marketSnapshot => {
        const timestampMs = marketSnapshot.blockTimestamp * 1000;

        supplyChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.supplyApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalSupplyCents),
        });

        borrowChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.borrowApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalBorrowCents),
        });
      });

    return {
      isLoading,
      data: { supplyChartData, borrowChartData },
    };
  }, [JSON.stringify(marketSnapshotsData?.marketSnapshots)]);
};

export default useGetChartData;
