import { MarketPageGrid } from 'components';
import { InterestRateChart } from 'containers/InterestRateChart';
import { SpokeForm } from 'containers/SpokeForm';
import { useSelectedSpokeCollateral } from 'hooks/useSelectedSpokeCollateral';
import type { SpokeAsset, SpokePool } from 'types';

import { BorrowInfo } from '../BorrowInfo';
import { LoanInfo } from '../LoanInfo';
import { SupportedCollateral } from '../SupportedCollateral';

// TODO: fetch from API (VPD-2071)
import { getSpokeIrmSimulations } from '__mocks__/models/spokeIrm';

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
          // A different market is a different form, so the tabs start from the PRD default
          // rather than carrying the previous market's selection over
          key={asset.vToken.address}
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

          <InterestRateChart
            asset={asset}
            isIsolatedPoolMarket
            simulations={getSpokeIrmSimulations({ asset })}
          />

          <LoanInfo asset={asset} />
        </div>
      }
    />
  );
};
