import BigNumber from 'bignumber.js';
import { ApyChartProps } from 'components';
import React from 'react';
import { VBepToken } from 'types';
import { formatPercentage } from 'utilities';

import { useGetMarketHistory } from 'clients/api';

const useGetChartData = ({ vTokenId }: { vTokenId: VBepToken['id'] }) => {
  const { data: marketSnapshots = [] } = useGetMarketHistory({
    vTokenId,
  });

  return React.useMemo(() => {
    const supplyChartData: ApyChartProps['data'] = [];
    const borrowChartData: ApyChartProps['data'] = [];

    [...marketSnapshots]
      // Snapshots are returned from earliest to oldest, so we reverse them to
      // pass them to the charts in the right order
      .reverse()
      .forEach(marketSnapshot => {
        const timestampMs = new Date(marketSnapshot.createdAt).getTime();

        supplyChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.supplyApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalSupply).multipliedBy(
            marketSnapshot.priceUSD,
          ),
        });

        borrowChartData.push({
          apyPercentage: formatPercentage(marketSnapshot.borrowApy),
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalBorrow).multipliedBy(
            marketSnapshot.priceUSD,
          ),
        });
      });

    return {
      supplyChartData,
      borrowChartData,
    };
  }, [JSON.stringify(marketSnapshots)]);
};

export default useGetChartData;
