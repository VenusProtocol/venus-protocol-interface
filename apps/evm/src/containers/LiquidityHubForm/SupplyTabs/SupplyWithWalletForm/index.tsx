import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useSupplyToLiquidityHub } from 'clients/api';
import type { TokenApproval } from 'containers/TxFormSubmitButton';
import { WalletBalance } from 'containers/WalletBalance';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAnalytics } from 'libs/analytics';
import { isUserRejectedTxError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { calculateAmountDollars } from '../../../MarketForm/calculateAmountDollars';
import { type AmountSetInput, Form, type FormValues, initialFormValues } from '../../Form';
import type { UseFormValidationInput } from '../../Form/useForm/useFormValidation';

export interface SupplyWithWalletFormProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const SupplyWithWalletForm: React.FC<SupplyWithWalletFormProps> = ({
  liquidityHub,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const [formValues, setFormValues] = useState(initialFormValues);
  const { accountAddress } = useAccountAddress();

  const approval: TokenApproval = {
    type: 'token',
    token: liquidityHub.vhToken.underlyingToken,
    spenderAddress: liquidityHub.vhToken.address,
  };

  const { walletSpendingLimitTokens } = useTokenApproval({
    token: approval.token,
    spenderAddress: approval.spenderAddress,
    accountAddress,
  });

  const marginWithSupplyCapTokens = liquidityHub.supplyCapTokens.minus(
    liquidityHub.supplyBalanceTokens,
  );

  let limitTokens = BigNumber.min(
    liquidityHub.userWalletBalanceTokens ?? 0,
    marginWithSupplyCapTokens,
  );

  if (walletSpendingLimitTokens?.isGreaterThan(0)) {
    limitTokens = BigNumber.min(limitTokens, walletSpendingLimitTokens);
  }

  if (liquidityHub.userSupplyCapTokens) {
    limitTokens = BigNumber.min(limitTokens, liquidityHub.userSupplyCapTokens);
  }

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  const handleValidateForm: UseFormValidationInput['validate'] = () => {
    if (
      liquidityHub.userWalletBalanceTokens &&
      fromAmountTokens?.isGreaterThan(liquidityHub.userWalletBalanceTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('marketForm.error.higherThanWalletBalance', {
          tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
        }),
      };
    }

    if (
      walletSpendingLimitTokens?.isGreaterThan(0) &&
      fromAmountTokens?.isGreaterThan(walletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('liquidityHubForm.error.higherThanWalletSpendingLimit'),
      };
    }
  };

  const { mutateAsync: supplyToLiquidityHub, isPending: isSubmitting } = useSupplyToLiquidityHub();

  const getAnalyticData = (amountTokens: BigNumber | string) => ({
    poolName: 'liquidity_hub',
    assetSymbol: liquidityHub.vhToken.underlyingToken.symbol,
    usdAmount: calculateAmountDollars({
      amountTokens,
      tokenPriceCents: liquidityHub.tokenPriceCents,
    }),
    fundingSource: 'wallet' as const,
  });

  const captureAmountSetAnalyticEvent = ({ amountTokens, maxSelected }: AmountSetInput) => {
    if (Number(amountTokens) <= 0) {
      return;
    }

    captureAnalyticEvent(
      'supply_amount_set',
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
    const analyticData = getAnalyticData(amountTokens);

    try {
      captureAnalyticEvent('supply_initiated', analyticData);

      await supplyToLiquidityHub({
        liquidityHub,
        amountMantissa,
      });

      captureAnalyticEvent('supply_signed', analyticData);
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('supply_rejected', analyticData);
      }

      throw error;
    }
  };

  const balanceMutations: LiquidityHubBalanceMutation[] = [
    {
      type: 'liquidityHub',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: fromAmountTokens || new BigNumber(0),
      action: 'supply',
    },
  ];

  const availableBalanceDom = (
    <WalletBalance
      token={liquidityHub.vhToken.underlyingToken}
      spenderAddress={liquidityHub.vhToken.address}
      onBalanceClick={walletBalanceTokens => {
        captureAmountSetAnalyticEvent({
          amountTokens: walletBalanceTokens,
          maxSelected: true,
        });

        setFormValues(currFormValues => ({
          ...currFormValues,
          amountTokens: walletBalanceTokens.toFixed(),
        }));
      }}
    />
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
      submitButtonLabel={t('liquidityHubForm.supplySubmitButtonLabel')}
      approval={approval}
      limitTokens={limitTokens}
      availableBalance={availableBalanceDom}
      validateForm={handleValidateForm}
      onAmountSet={captureAmountSetAnalyticEvent}
    />
  );
};
