import type { Asset } from 'types';

import type { MarketHistoryPeriodType } from 'clients/api';
import { useState } from 'react';
import TEST_IDS from '../../testIds';
import { Card } from './Card';
import useGetChartData from './useGetChartData';

interface MarketHistoryProps {
  asset: Asset;
  poolComptrollerContractAddress: string;
}

export const MarketHistory: React.FC<MarketHistoryProps> = ({
  asset,
  poolComptrollerContractAddress,
}) => {
  const [selectedSupplyPeriod, setSelectedSupplyPeriod] = useState<MarketHistoryPeriodType>('year');
  const [selectedBorrowPeriod, setSelectedBorrowPeriod] = useState<MarketHistoryPeriodType>('year');

  const {
    data: { supplyChartData },
    isLoading: isSupplyChartDataLoading,
  } = useGetChartData({
    vToken: asset.vToken,
    period: selectedSupplyPeriod,
  });

  const {
    data: { borrowChartData },
    isLoading: isBorrowChartDataLoading,
  } = useGetChartData({
    vToken: asset.vToken,
    period: selectedBorrowPeriod,
  });

  return (
    <div className="space-y-6">
      <Card
        asset={asset}
        type="supply"
        testId={TEST_IDS.supplyInfo}
        data={supplyChartData ?? []}
        isLoading={isSupplyChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
        selectedPeriod={selectedSupplyPeriod}
        setSelectedPeriod={setSelectedSupplyPeriod}
      />

      <Card
        asset={asset}
        type="borrow"
        testId={TEST_IDS.borrowInfo}
        data={borrowChartData ?? []}
        isLoading={isBorrowChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
        selectedPeriod={selectedBorrowPeriod}
        setSelectedPeriod={setSelectedBorrowPeriod}
      />
    </div>
  );
};
