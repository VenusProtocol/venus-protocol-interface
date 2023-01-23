import BigNumber from 'bignumber.js';
import { ApyChartProps } from 'components';
import React from 'react';
import { VToken } from 'types';
import { formatPercentage } from 'utilities';

import { useGetMainMarketHistory } from 'clients/api';

const useGetChartData = ({ vToken }: { vToken: VToken }) => {
  const {
    data: marketSnapshotsData = {
      marketSnapshots: [],
    },
  } = useGetMainMarketHistory({
    vToken,
  });

  return React.useMemo(() => {
    const supplyChartData: ApyChartProps['data'] = [];
    const borrowChartData: ApyChartProps['data'] = [];

    [...marketSnapshotsData.marketSnapshots]
      // Snapshots are returned from earliest to oldest, so we reverse them to
      // pass them to the charts in the right order
      .reverse()
      .forEach(marketSnapshot => {
        const timestampMs = marketSnapshot.blockTimestamp * 1000;

        supplyChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.supplyApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalSupply).multipliedBy(100),
        });

        borrowChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.borrowApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalBorrow).multipliedBy(100),
        });
      });

    return {
      supplyChartData,
      borrowChartData,
    };
  }, [JSON.stringify(marketSnapshotsData?.marketSnapshots)]);
};

export default useGetChartData;
