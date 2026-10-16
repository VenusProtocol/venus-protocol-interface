import { QuaternaryButton } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useRepayToSpoke } from 'clients/api';
import { type ApyBreakdownItem, AvailableBalance, NoticeWarning, SpendingLimit } from 'components';
import { TRANSACTION_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
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
  const [fullRepayAmountTokens, setFullRepayAmountTokens] = useState<string>();
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
      !!amountTokens &&
      amountTokens === fullRepayAmountTokens &&
      asset.userWalletBalanceTokens.isLessThan(
        asset.userBorrowBalanceTokens.multipliedBy(1 + TRANSACTION_BUFFER_PERCENTAGE / 100),
      )
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('marketForm.error.higherThanWalletBalance', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      };
    }

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

  useEffect(() => {
    if (
      formValues.amountTokens &&
      new BigNumber(formValues.amountTokens).isGreaterThanOrEqualTo(
        asset.userBorrowBalanceTokens.dp(decimals),
      )
    ) {
      setFullRepayAmountTokens(formValues.amountTokens);
    }
  }, [formValues.amountTokens, asset.userBorrowBalanceTokens, decimals]);

  const isFullRepay =
    !!formValues.amountTokens && formValues.amountTokens === fullRepayAmountTokens;

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      amountTokens: isFullRepay
        ? BigNumber.max(formValues.amountTokens, asset.userBorrowBalanceTokens)
        : new BigNumber(formValues.amountTokens || 0),
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

  const handlePercentageClick = (percentage: number) =>
    setFormValues(values => ({
      ...values,
      amountTokens: asset.userBorrowBalanceTokens
        .multipliedBy(percentage / 100)
        .dp(decimals)
        .toFixed(),
    }));

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
          onClick={() => handlePercentageClick(percentage)}
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
      repayFullLoan:
        submittedFormValues.amountTokens === fullRepayAmountTokens ||
        amountTokens.isGreaterThanOrEqualTo(asset.userBorrowBalanceTokens.dp(decimals)),
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
