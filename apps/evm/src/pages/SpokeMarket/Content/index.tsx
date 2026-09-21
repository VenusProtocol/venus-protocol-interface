import { MarketPageGrid } from 'components';
import { InterestRateChart } from 'containers/InterestRateChart';
import { SpokeForm } from 'containers/SpokeForm';
import { useSelectedSpokeCollateral } from 'hooks/useSelectedSpokeCollateral';
import type { SpokeAsset, SpokePool } from 'types';

import { BorrowInfo } from '../BorrowInfo';
import { LoanInfo } from '../LoanInfo';
import { SupportedCollateral } from '../SupportedCollateral';

export interface ContentProps {
  spokePool: SpokePool;
  asset: SpokeAsset;
}

export const Content: React.FC<ContentProps> = ({ spokePool, asset }) => {
  const collaterals = spokePool.assets.filter(({ isBorrowable }) => !isBorrowable);

  const { selectedCollateral, selectCollateral } = useSelectedSpokeCollateral({ collaterals });

  return (
    <MarketPageGrid
      form={
        <SpokeForm
          spokePool={spokePool}
          asset={asset}
          preselectedCollateral={selectedCollateral}
          navType="searchParam"
        />
      }
      content={
        <div className="space-y-6">
          <BorrowInfo asset={asset} />

          <SupportedCollateral collaterals={collaterals} onRowClick={selectCollateral} />

          <InterestRateChart asset={asset} isIsolatedPoolMarket />

          <LoanInfo asset={asset} />
        </div>
      }
    />
  );
};
