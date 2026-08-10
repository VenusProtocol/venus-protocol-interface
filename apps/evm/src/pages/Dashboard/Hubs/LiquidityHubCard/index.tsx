import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { To } from 'react-router';

import { type CellProps, StatusLabel, TokenIcon, TokenIconWithSymbol } from 'components';
import { DAYS_PER_YEAR } from 'constants/time';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedApy,
} from 'utilities';
import { PreviewCard, type PreviewCardProps } from '../../PreviewCard';

export interface LiquidityHubCardProps {
  liquidityHub: LiquidityHub;
  to?: To;
  className?: string;
}

export const LiquidityHubCard: React.FC<LiquidityHubCardProps> = ({
  liquidityHub,
  className,
  to,
}) => {
  const { t } = useTranslation();
  const underlyingToken = liquidityHub.vhToken.underlyingToken;
  const userSupplyBalanceTokens = liquidityHub.userSupplyBalanceTokens ?? new BigNumber(0);
  const userSupplyBalanceCents = liquidityHub.userSupplyBalanceCents ?? new BigNumber(0);
  const hasUserSupplyBalance =
    userSupplyBalanceTokens.isGreaterThan(0) || userSupplyBalanceCents.isGreaterThan(0);

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const showModal = () => setShouldShowModal(true);
  const hideModal = () => setShouldShowModal(false);

  const { totalApyPercentage } = getCombinedApy({
    type: 'supply',
    baseApyPercentage: liquidityHub.supplyApyPercentage,
    tokenDistributions: liquidityHub.supplyTokenDistributions,
  });

  const totalSuppliedReadableValue = (
    <div className="flex items-center justify-end gap-2 min-w-0">
      <TokenIcon token={underlyingToken} displayChain={false} size="md" className="shrink-0" />

      <span className="truncate min-w-0">
        {formatTokensToReadableValue({
          value: liquidityHub.supplyBalanceTokens,
          token: underlyingToken,
        })}
      </span>
    </div>
  );

  const cells: CellProps[] = [
    {
      label: t('dashboard.hubs.apy'),
      value: formatPercentageToReadableValue(totalApyPercentage),
    },
  ];

  if (hasUserSupplyBalance) {
    cells.push({
      label: t('dashboard.hubs.dailyEarnings'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({
            value: (liquidityHub.userYearlyEarningsCents ?? new BigNumber(0)).dividedBy(
              DAYS_PER_YEAR,
            ),
          })}
        </HidableUserBalance>
      ),
    });
  }

  if (!hasUserSupplyBalance) {
    cells.push({
      label: t('dashboard.previewCard.totalSupplied'),
      value: totalSuppliedReadableValue,
    });
  }

  const previewCardBaseProps = {
    className,
    header: hasUserSupplyBalance ? (
      <div className="min-w-0 text-b1r text-light-grey">
        <span>{t('dashboard.previewCard.currentlySupplied')}</span>

        <div className="flex items-center text-p2s gap-2 text-light-grey-active min-w-0">
          <TokenIcon token={underlyingToken} displayChain={false} size="lg" className="shrink-0" />

          <span className="truncate min-w-0">
            <HidableUserBalance>
              {formatTokensToReadableValue({
                value: userSupplyBalanceTokens,
                token: underlyingToken,
              })}
            </HidableUserBalance>
          </span>
        </div>
      </div>
    ) : (
      <TokenIconWithSymbol
        token={underlyingToken}
        displayChain={false}
        size="lg"
        className="min-w-0 text-p2s"
      />
    ),
    status: <StatusLabel status="supply" className="shrink-0" />,
    cells,
  };

  let previewCardProps: PreviewCardProps = previewCardBaseProps;

  if (hasUserSupplyBalance) {
    previewCardProps = {
      ...previewCardBaseProps,
      onClick: showModal,
    };
  } else {
    previewCardProps = {
      ...previewCardBaseProps,
      to,
    };
  }

  return (
    <>
      <PreviewCard {...previewCardProps} />

      {shouldShowModal && (
        <LiquidityHubFormModal vhToken={liquidityHub.vhToken} handleClose={hideModal} />
      )}
    </>
  );
};
