import BigNumber from 'bignumber.js';
import { useState } from 'react';

import type { TokenApproval } from 'containers/TxFormSubmitButton';
import { WalletBalance } from 'containers/WalletBalance';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { Form, type FormValues, initialFormValues } from '../../Form';
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

  const limitTokens = liquidityHub.userWalletBalanceTokens ?? new BigNumber(0);

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

  // TODO: wire up
  const handleSubmit = async (_formValues: FormValues) => {};

  // TODO: wire up
  const isSubmitting = false;

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
      onBalanceClick={walletBalanceTokens =>
        setFormValues(currFormValues => ({
          ...currFormValues,
          amountTokens: walletBalanceTokens.toFixed(),
        }))
      }
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
    />
  );
};
