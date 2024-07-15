import type { Asset } from 'types';

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
  const { data: chartData, isLoading: isChartDataLoading } = useGetChartData({
    vToken: asset.vToken,
  });

  return (
    <div className="space-y-6">
      <Card
        asset={asset}
        type="supply"
        testId={TEST_IDS.supplyInfo}
        data={chartData.supplyChartData ?? []}
        isLoading={isChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
      />

      <Card
        asset={asset}
        type="borrow"
        testId={TEST_IDS.borrowInfo}
        data={chartData.borrowChartData ?? []}
        isLoading={isChartDataLoading}
        poolComptrollerContractAddress={poolComptrollerContractAddress}
      />
    </div>
  );
};
