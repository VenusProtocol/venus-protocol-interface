import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { AvailableBalance } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';

export interface WithdrawFormProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ liquidityHub, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const limitTokens = BigNumber.min(
    liquidityHub.userSupplyBalanceTokens ?? new BigNumber(0),
    liquidityHub.liquidityTokens,
  );

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  // TODO: wire up
  const handleSubmit = async (_formValues: FormValues) => {};

  // TODO: wire up
  const isSubmitting = false;

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
          amountTokens: limitTokens.dp(liquidityHub.vhToken.decimals).toFixed(),
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
