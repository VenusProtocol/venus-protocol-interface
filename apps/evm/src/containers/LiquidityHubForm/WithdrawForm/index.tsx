import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useWithdrawFromLiquidityHub } from 'clients/api';
import { AvailableBalance } from 'components';
import { TRANSACTION_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';

export interface WithdrawFormProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ liquidityHub, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const userMaxRedeemTokens = liquidityHub.userVhTokenMaxRedeemTokens?.multipliedBy(
    liquidityHub.pricePerShare,
  );

  const limitTokens = BigNumber.min(
    liquidityHub.userWithdrawCapTokens ?? 0,
    userMaxRedeemTokens ?? 0,
  )
    // Apply buffer to account for accruing interests that lower the limits while a transaction is
    // being executed
    .multipliedBy(1 - TRANSACTION_BUFFER_PERCENTAGE);

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  const { mutateAsync: withdrawFromLiquidityHub, isPending: isSubmitting } =
    useWithdrawFromLiquidityHub();

  const handleSubmit = async (submittedFormValues: FormValues) => {
    const amountTokens = new BigNumber(submittedFormValues.amountTokens);
    const amountMantissa = convertTokensToMantissa({
      token: liquidityHub.vhToken.underlyingToken,
      value: amountTokens,
    });

    const withdrawFullSupply = amountTokens.isGreaterThanOrEqualTo(
      userMaxRedeemTokens ?? Number.POSITIVE_INFINITY,
    );

    const userVhTokenBalanceMantissa = liquidityHub.userVhTokenBalanceTokens
      ? convertTokensToMantissa({
          token: liquidityHub.vhToken,
          value: liquidityHub.userVhTokenBalanceTokens,
        })
      : undefined;

    await withdrawFromLiquidityHub({
      liquidityHub,
      amountMantissa,
      withdrawFullSupply,
      userVhTokenBalanceMantissa,
    });
  };

  const balanceMutations: LiquidityHubBalanceMutation[] = [
    {
      type: 'liquidityHub',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: fromAmountTokens || new BigNumber(0),
      action: 'withdraw',
    },
  ];

  const handleLimitClick = limitTokens.isGreaterThan(0)
    ? () =>
        setFormValues(values => ({
          ...values,
          amountTokens: limitTokens.dp(liquidityHub.vhToken.underlyingToken.decimals).toFixed(),
        }))
    : undefined;

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: liquidityHub.vhToken.underlyingToken,
  });

  const availableBalanceDom = (
    <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />
  );

  return (
    <Form
      isSubmitting={isSubmitting}
      liquidityHub={liquidityHub}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      submitButtonLabel={t('liquidityHubForm.withdrawSubmitButtonLabel')}
      limitTokens={limitTokens}
      availableBalance={availableBalanceDom}
    />
  );
};
