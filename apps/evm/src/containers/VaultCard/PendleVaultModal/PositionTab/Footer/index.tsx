import type BigNumber from 'bignumber.js';
import type { ReactElement } from 'react';
import { Fragment } from 'react/jsx-runtime';

import type { GetPendleSwapQuoteOutput } from 'clients/api';
import { Delimiter, LabeledInlineContent } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import type { PendleVault } from 'types';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { PendleVaultAction } from '../../types';
import { PendleConvertDetails } from './PendleConvertDetails';

export interface FooterProps {
  vault: PendleVault;
  actionMode: PendleVaultAction;
  fromToken: Token;
  toToken: Token;
  userStakedTokens: BigNumber;
  userSlippageTolerancePercentage?: number;
  swapQuote?: GetPendleSwapQuoteOutput;
  estDiffAmountReadable?: string;
}

export const Footer: React.FC<FooterProps> = ({
  actionMode,
  vault,
  fromToken,
  toToken,
  userStakedTokens,
  userSlippageTolerancePercentage,
  swapQuote,
  estDiffAmountReadable,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isStake = actionMode === 'deposit';

  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedTokens,
    token: vault.rewardToken,
  });

  const shouldShowConversionDetails =
    accountAddress &&
    actionMode !== 'redeemAtMaturity' &&
    typeof userSlippageTolerancePercentage === 'number';

  const sections: ReactElement[] = [];

  if (accountAddress) {
    sections.push(
      <>
        <LabeledInlineContent
          key="currentDeposited"
          label={t('vault.modals.currentDeposited')}
          tooltip={t('vault.modals.currentDepositedTooltip')}
        >
          {readableUserStaked}
        </LabeledInlineContent>

        {!shouldShowConversionDetails && <Delimiter />}
      </>,
    );
  }

  if (shouldShowConversionDetails) {
    sections.push(
      <PendleConvertDetails
        key="convertDetails"
        fromToken={fromToken}
        toToken={toToken}
        slippagePercentage={userSlippageTolerancePercentage}
        swapQuote={swapQuote}
      />,
    );
  }

  if (isStake) {
    sections.push(
      <>
        <LabeledInlineContent
          key="apr"
          label={t('vault.modals.effectiveFixedApr')}
          tooltip={t('vault.modals.effectiveFixedAprPendleTooltip')}
        >
          {formatPercentageToReadableValue(vault.stakingAprPercentage)}
        </LabeledInlineContent>

        <Delimiter />
      </>,
    );
  }

  if (accountAddress) {
    sections.push(
      <>
        <LabeledInlineContent
          key="estimatedDifference"
          label={isStake ? t('vault.modals.estYield') : t('vault.modals.estPenalty')}
        >
          {estDiffAmountReadable}
        </LabeledInlineContent>

        <Delimiter />
      </>,
    );
  }

  sections.push(
    <>
      <LabeledInlineContent
        key="maturityDate"
        label={t('vault.modals.maturityDate')}
        tooltip={t('vault.modals.maturityDatePendleTooltip')}
      >
        {t('vault.modals.textualWithTime', { date: vault.maturityDate })}
      </LabeledInlineContent>
    </>,
  );

  return (
    <div className="flex flex-col gap-y-4">
      {sections.map((section, index) => (
        <Fragment key={index}>{section}</Fragment>
      ))}
    </div>
  );
};
