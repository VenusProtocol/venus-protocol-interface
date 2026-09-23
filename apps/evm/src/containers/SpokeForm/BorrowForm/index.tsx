import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { type ApyBreakdownItem, AvailableBalance, NoticeWarning } from 'components';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, SpokeAsset, SpokePool } from 'types';
import { clampToZero, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';
import { ZeroCollateralNotice } from './ZeroCollateralNotice';
import { getBorrowLimits } from './getBorrowLimits';

export interface BorrowFormProps {
  spokePool: SpokePool;
  asset: SpokeAsset;
  onSupplyCollateralClick: () => void;
  onSubmitSuccess?: () => void;
}

export const BorrowForm: React.FC<BorrowFormProps> = ({
  spokePool,
  asset,
  onSupplyCollateralClick,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const hasCollateralSupplied = spokePool.assets.some(
    poolAsset => !poolAsset.isBorrowable && poolAsset.userSupplyBalanceTokens.isGreaterThan(0),
  );

  const isBorrowDisabled = asset.disabledTokenActions.includes('borrow');

  const { limitTokens, safeLimitTokens } = getBorrowLimits({ spokePool, asset });

  // Borrowing being paused leaves nothing to fill in, so the notice stands in for the form
  if (isBorrowDisabled) {
    return <NoticeWarning description={t('assetAccessor.disabledActionNotice.borrow')} />;
  }

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      amountTokens: formValues.amountTokens
        ? new BigNumber(formValues.amountTokens)
        : new BigNumber(0),
      action: 'borrow',
    },
  ];

  const apyBreakdownItems: ApyBreakdownItem[] = [
    {
      type: 'borrow',
      token: asset.vToken.underlyingToken,
      baseApyPercentage: asset.borrowApyPercentage,
      tokenDistributions: asset.borrowTokenDistributions,
    },
  ];

  const handleLimitClick = limitTokens.isGreaterThan(0)
    ? () =>
        setFormValues(values => ({
          ...values,
          amountTokens: safeLimitTokens.dp(asset.vToken.underlyingToken.decimals).toFixed(),
        }))
    : undefined;

  const validateForm = hasCollateralSupplied
    ? undefined
    : () => ({ code: 'NO_COLLATERAL_SUPPLIED' as const });

  const availableBalanceDom = (
    <AvailableBalance
      readableBalance={formatTokensToReadableValue({
        value: clampToZero({ value: limitTokens }),
        token: asset.vToken.underlyingToken,
      })}
      onClick={handleLimitClick}
    />
  );

  // Throws until VPD-2072 wires the contracts, so a submission is never reported as a success
  const handleSubmit = async (_submittedFormValues: FormValues) => {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  };

  return (
    <Form
      spokePool={spokePool}
      token={asset.vToken.underlyingToken}
      isSubmitting={false}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      submitButtonLabel={t('spokeForm.borrow.submitButtonLabel')}
      rightMaxButtonLabel={t('spokeForm.safeMaxButtonLabel')}
      limitTokens={limitTokens}
      safeLimitTokens={safeLimitTokens}
      availableBalance={availableBalanceDom}
      apyBreakdownItems={apyBreakdownItems}
      showDailyBorrowInterest
      validateForm={validateForm}
      belowAmountInput={
        hasCollateralSupplied ? undefined : (
          <ZeroCollateralNotice
            tokenSymbol={asset.vToken.underlyingToken.symbol}
            onSupplyClick={onSupplyCollateralClick}
          />
        )
      }
    />
  );
};
