import { QuaternaryButton } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { type ApyBreakdownItem, AvailableBalance } from 'components';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, SpokeAsset, SpokePool } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';
import { PRESET_REPAY_PERCENTAGES } from './constants';

export interface RepayFormProps {
  spokePool: SpokePool;
  asset: SpokeAsset;
  onSubmitSuccess?: () => void;
}

export const RepayForm: React.FC<RepayFormProps> = ({ spokePool, asset, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const [formValues, setFormValues] = useState(initialFormValues);

  const { decimals } = asset.vToken.underlyingToken;

  const limitTokens = BigNumber.min(
    asset.userBorrowBalanceTokens,
    asset.userWalletBalanceTokens,
  ).dp(decimals);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      amountTokens: formValues.amountTokens
        ? new BigNumber(formValues.amountTokens)
        : new BigNumber(0),
      action: 'repay',
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
          amountTokens: limitTokens.toFixed(),
        }))
    : undefined;

  const availableBalanceDom = (
    <AvailableBalance
      label={t('spokeForm.repay.walletBalanceLabel')}
      readableBalance={formatTokensToReadableValue({
        value: asset.userWalletBalanceTokens,
        token: asset.vToken.underlyingToken,
      })}
      onClick={handleLimitClick}
    />
  );

  const isRepayDisabled = !accountAddress || asset.userBorrowBalanceTokens.isEqualTo(0);

  const percentageChips = (
    <div className="flex gap-x-2">
      {PRESET_REPAY_PERCENTAGES.map(percentage => (
        <QuaternaryButton
          key={`spoke-repay-percentage-${percentage}`}
          className="flex-1"
          size="xs"
          rounded
          disabled={isRepayDisabled}
          onClick={() =>
            setFormValues(values => ({
              ...values,
              amountTokens: asset.userBorrowBalanceTokens
                .multipliedBy(percentage / 100)
                .dp(decimals)
                .toFixed(),
            }))
          }
        >
          {percentage}%
        </QuaternaryButton>
      ))}
    </div>
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
      submitButtonLabel={t('spokeForm.repay.submitButtonLabel')}
      limitTokens={limitTokens}
      availableBalance={availableBalanceDom}
      apyBreakdownItems={apyBreakdownItems}
      belowAmountInput={percentageChips}
      approval={{
        type: 'token',
        token: asset.vToken.underlyingToken,
        spenderAddress: asset.vToken.address,
      }}
    />
  );
};
