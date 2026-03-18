import type { Asset } from 'types';

import type { MarketHistoryPeriodType } from 'clients/api';
import { useGetMarketChartData } from 'hooks/useGetMarketChartData';
import { useState } from 'react';
import type { Address } from 'viem';
import TEST_IDS from '../testIds';
import { Card } from './Card';

interface MarketHistoryProps {
  asset: Asset;
  poolComptrollerContractAddress: Address;
}

export const MarketHistory: React.FC<MarketHistoryProps> = ({
  asset,
  poolComptrollerContractAddress,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<MarketHistoryPeriodType>('month');

  const {
    data: { supplyChartData, borrowChartData },
    isLoading: isChartDataLoading,
  } = useGetMarketChartData({
    vToken: asset.vToken,
    period: selectedPeriod,
  });

  return (
    <div className="space-y-6">
      <Card
        asset={asset}
        type="supply"
        data-testid={TEST_IDS.supplyInfo}
        data={supplyChartData ?? []}
        isLoading={isChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <Card
        asset={asset}
        type="borrow"
        data-testid={TEST_IDS.borrowInfo}
        data={borrowChartData ?? []}
        isLoading={isChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />
    </div>
  );
};
