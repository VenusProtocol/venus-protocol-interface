import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Address } from 'viem';

import { AvailableBalance, SpendingLimit } from 'components';
import type { TokenApproval } from 'containers/TxFormSubmitButton';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type {
  Asset,
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
} from 'types';
import { calculateCollateralWithdrawLimits, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../../Form';
import type { UseFormValidationInput } from '../../Form/useForm/useFormValidation';

export interface SupplyWithCollateralFormProps {
  liquidityHubMigratorContractAddress: Address;
  corePoolAsset: Asset;
  corePool: Pool;
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const SupplyWithCollateralForm: React.FC<SupplyWithCollateralFormProps> = ({
  liquidityHub,
  onSubmitSuccess,
  liquidityHubMigratorContractAddress,
  corePoolAsset,
  corePool,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  const { accountAddress } = useAccountAddress();

  const { limitTokens, safeLimitTokens } = calculateCollateralWithdrawLimits({
    asset: corePoolAsset,
    pool: corePool,
  });

  const approval: TokenApproval = {
    type: 'token',
    token: corePoolAsset.vToken,
    spenderAddress: liquidityHubMigratorContractAddress,
  };

  const {
    walletSpendingLimitTokens: walletSpendingLimitVTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: approval.token,
    spenderAddress: approval.spenderAddress,
    accountAddress,
  });

  // Convert vToken spending limit to underlying tokens
  const walletSpendingLimitTokens = walletSpendingLimitVTokens?.div(
    corePoolAsset.exchangeRateVTokens,
  );

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  const handleValidateForm: UseFormValidationInput['validate'] = () => {
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

  const balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation> = [
    {
      type: 'asset',
      vTokenAddress: corePoolAsset.vToken.address,
      amountTokens: fromAmountTokens || new BigNumber(0),
      action: 'withdraw',
      description: t('liquidityHubForm.balanceUpdates.corePool'),
    },
    {
      type: 'liquidityHub',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: fromAmountTokens || new BigNumber(0),
      action: 'supply',
      description: t('liquidityHubForm.balanceUpdates.liquidityHub'),
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
    <div className="space-y-2">
      <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

      <SpendingLimit
        token={corePoolAsset.vToken.underlyingToken}
        walletBalanceTokens={corePoolAsset.userWalletBalanceTokens}
        walletSpendingLimitTokens={walletSpendingLimitTokens}
        onRevoke={revokeWalletSpendingLimit}
        isRevokeLoading={isRevokeWalletSpendingLimitLoading}
      />
    </div>
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
      rightMaxButtonLabel={t('liquidityHubForm.rightSafeMaxButtonLabel')}
      submitButtonLabel={t('liquidityHubForm.supplySubmitButtonLabel')}
      approval={approval}
      limitTokens={limitTokens}
      safeLimitTokens={safeLimitTokens}
      availableBalance={availableBalanceDom}
      validateForm={handleValidateForm}
    />
  );
};
