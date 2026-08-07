import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useWithdrawFromLiquidityHub } from 'clients/api';
import { AvailableBalance } from 'components';
import { useAnalytics } from 'libs/analytics';
import { isUserRejectedTxError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { calculateAmountDollars } from '../../MarketForm/calculateAmountDollars';
import { type AmountSetInput, Form, type FormValues, initialFormValues } from '../Form';

export interface WithdrawFormProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ liquidityHub, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const [formValues, setFormValues] = useState(initialFormValues);

  const userMaxRedeemTokens = liquidityHub.userVhTokenMaxRedeemTokens?.multipliedBy(
    liquidityHub.pricePerShare,
  );

  const limitTokens = BigNumber.min(
    liquidityHub.userWithdrawCapTokens ?? 0,
    userMaxRedeemTokens ?? 0,
  );

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  const { mutateAsync: withdrawFromLiquidityHub, isPending: isSubmitting } =
    useWithdrawFromLiquidityHub();

  const getAnalyticData = (amountTokens: BigNumber | string) => ({
    poolName: 'liquidity_hub',
    assetSymbol: liquidityHub.vhToken.underlyingToken.symbol,
    usdAmount: calculateAmountDollars({
      amountTokens,
      tokenPriceCents: liquidityHub.tokenPriceCents,
    }),
  });

  const captureAmountSetAnalyticEvent = ({ amountTokens, maxSelected }: AmountSetInput) => {
    if (Number(amountTokens) <= 0) {
      return;
    }

    captureAnalyticEvent(
      'withdraw_amount_set',
      {
        ...getAnalyticData(amountTokens),
        maxSelected,
      },
      {
        debounced: true,
      },
    );
  };

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
    const analyticData = getAnalyticData(amountTokens);

    try {
      captureAnalyticEvent('withdraw_initiated', analyticData);

      await withdrawFromLiquidityHub({
        liquidityHub,
        amountMantissa,
        withdrawFullSupply,
        userVhTokenBalanceMantissa,
      });

      captureAnalyticEvent('withdraw_signed', analyticData);
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('withdraw_rejected', analyticData);
      }

      throw error;
    }
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
    ? () => {
        const amountTokens = limitTokens
          .dp(liquidityHub.vhToken.underlyingToken.decimals)
          .toFixed();

        captureAmountSetAnalyticEvent({
          amountTokens,
          maxSelected: true,
        });

        setFormValues(values => ({
          ...values,
          amountTokens,
        }));
      }
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
      onAmountSet={captureAmountSetAnalyticEvent}
    />
  );
};
