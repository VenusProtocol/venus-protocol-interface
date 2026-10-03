import { QuaternaryButton } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useRepayToSpoke } from 'clients/api';
import { type ApyBreakdownItem, AvailableBalance, NoticeWarning, SpendingLimit } from 'components';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, SpokeAsset, SpokePool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';
import type { UseFormValidationInput } from '../Form/useForm/useFormValidation';
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
  const { mutateAsync: repay, isPending: isSubmitting } = useRepayToSpoke();

  const { decimals } = asset.vToken.underlyingToken;

  const {
    walletSpendingLimitTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: asset.vToken.underlyingToken,
    spenderAddress: asset.vToken.address,
    accountAddress,
  });

  const availableTokens = BigNumber.min(
    asset.userBorrowBalanceTokens,
    asset.userWalletBalanceTokens,
  ).dp(decimals);

  const limitTokens = walletSpendingLimitTokens?.isGreaterThan(0)
    ? BigNumber.min(availableTokens, walletSpendingLimitTokens)
    : availableTokens;

  const validateForm: UseFormValidationInput['validate'] = ({ formValues: { amountTokens } }) => {
    if (
      walletSpendingLimitTokens?.isGreaterThan(0) &&
      new BigNumber(amountTokens).isGreaterThan(walletSpendingLimitTokens) &&
      new BigNumber(amountTokens).isLessThanOrEqualTo(availableTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('marketForm.error.higherThanWalletSpendingLimit'),
      };
    }
  };

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
    <div className="space-y-2">
      <AvailableBalance
        label={t('spokeForm.repay.walletBalanceLabel')}
        readableBalance={formatTokensToReadableValue({
          value: asset.userWalletBalanceTokens,
          token: asset.vToken.underlyingToken,
        })}
        onClick={handleLimitClick}
      />

      <SpendingLimit
        token={asset.vToken.underlyingToken}
        walletBalanceTokens={asset.userWalletBalanceTokens}
        walletSpendingLimitTokens={walletSpendingLimitTokens}
        onRevoke={revokeWalletSpendingLimit}
        isRevokeLoading={isRevokeWalletSpendingLimitLoading}
      />
    </div>
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

  if (asset.disabledTokenActions.includes('repay')) {
    return <NoticeWarning description={t('assetAccessor.disabledActionNotice.repay')} />;
  }

  const handleSubmit = (submittedFormValues: FormValues) => {
    const amountTokens = new BigNumber(submittedFormValues.amountTokens);

    return repay({
      vToken: asset.vToken,
      poolName: spokePool.name,
      amountMantissa: convertTokensToMantissa({
        value: amountTokens,
        token: asset.vToken.underlyingToken,
      }),
      repayFullLoan: amountTokens.isEqualTo(asset.userBorrowBalanceTokens.dp(decimals)),
    });
  };

  return (
    <Form
      spokePool={spokePool}
      token={asset.vToken.underlyingToken}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      submitButtonLabel={t('spokeForm.repay.submitButtonLabel')}
      limitTokens={limitTokens}
      availableBalance={availableBalanceDom}
      apyBreakdownItems={apyBreakdownItems}
      showDailyBorrowInterest
      belowAmountInput={percentageChips}
      validateForm={validateForm}
      approval={{
        type: 'token',
        token: asset.vToken.underlyingToken,
        spenderAddress: asset.vToken.address,
      }}
    />
  );
};
