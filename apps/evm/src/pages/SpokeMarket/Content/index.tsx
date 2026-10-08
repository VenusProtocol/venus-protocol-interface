import { useRef } from 'react';

import { MarketPageGrid } from 'components';
import { routes } from 'constants/routing';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { InterestRateChart } from 'containers/InterestRateChart';
import { SpokeForm } from 'containers/SpokeForm';
import { useBreakpointUp } from 'hooks/responsive';
import { useNavigate } from 'hooks/useNavigate';
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
  const { navigate } = useNavigate();
  const isLgOrUp = useBreakpointUp('lg');
  const formRef = useRef<HTMLDivElement>(null);

  const handleCollateralRowClick = (collateral: SpokeAsset) => {
    selectCollateral(collateral);

    if (!isLgOrUp) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <MarketPageGrid
        form={
          <div ref={formRef}>
            <SpokeForm
              // A different market is a different form, so the tabs start from the PRD default
              // rather than carrying the previous market's selection over
              key={asset.vToken.address}
              spokePool={spokePool}
              asset={asset}
              preselectedCollateral={selectedCollateral}
              navType="searchParam"
            />
          </div>
        }
        content={
          <div className="space-y-6">
            <BorrowInfo asset={asset} />

            <SupportedCollateral collaterals={collaterals} onRowClick={handleCollateralRowClick} />

            <InterestRateChart asset={asset} isIsolatedPoolMarket />

            <LoanInfo asset={asset} />
          </div>
        }
      />

      {spokePool.assets.some(({ isGated }) => isGated) && (
        <GatedAssetAcknowledgementModal onReject={() => navigate(routes.landing.path)} />
      )}
    </>
  );
};
