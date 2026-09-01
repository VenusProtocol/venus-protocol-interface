import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Address } from 'viem';

import { useGetVTokenBalance, useMigrateCoreSupplyToLiquidityHub } from 'clients/api';
import { AvailableBalance, SpendingLimit } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { formatUserMaxTokenValue } from 'containers/LiquidityHubForm/formatUserMaxTokenValue';
import type { TokenApproval } from 'containers/TxFormSubmitButton';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type {
  Asset,
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
} from 'types';
import {
  calculateCollateralWithdrawLimits,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
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

  let { limitTokens, safeLimitTokens } = calculateCollateralWithdrawLimits({
    asset: corePoolAsset,
    pool: corePool,
  });

  const userSupplyCapTokens = formatUserMaxTokenValue({
    value: liquidityHub.userSupplyCapTokens,
    decimals: liquidityHub.vhToken.underlyingToken.decimals,
  });

  if (userSupplyCapTokens) {
    safeLimitTokens = BigNumber.min(safeLimitTokens, userSupplyCapTokens);
    limitTokens = BigNumber.min(limitTokens, userSupplyCapTokens);
  }

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

  const isMigratingFullCoreSupply = !!fromAmountTokens?.isEqualTo(
    corePoolAsset.userSupplyBalanceTokens,
  );

  const { data: getVTokenBalanceData } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: corePoolAsset.vToken.address,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const userWalletVTokenBalanceMantissa = getVTokenBalanceData?.balanceMantissa;

  const fromAmountVTokens =
    isMigratingFullCoreSupply && userWalletVTokenBalanceMantissa
      ? convertMantissaToTokens({
          token: corePoolAsset.vToken,
          value: userWalletVTokenBalanceMantissa,
        })
      : fromAmountTokens?.times(corePoolAsset.exchangeRateVTokens);

  // The minimum a use can migrate from the Core Pool is 1 wei, so we use the exchange rate to
  // determine how much that represents in underlying tokens
  const minFromAmountTokens = convertMantissaToTokens({
    value: new BigNumber(1),
    token: corePoolAsset.vToken,
  }).dividedBy(corePoolAsset.exchangeRateVTokens);

  const handleValidateForm: UseFormValidationInput['validate'] = () => {
    if (fromAmountTokens?.isLessThan(minFromAmountTokens)) {
      return {
        code: 'SMALLER_THAN_MINIMUM_AMOUNT',
        message: t('liquidityHubForm.error.smallerThanMinimumAmount', {
          minimumAmount: `${minFromAmountTokens.toFixed(
            liquidityHub.vhToken.underlyingToken.decimals,
          )} ${liquidityHub.vhToken.underlyingToken.symbol}`,
        }),
      };
    }

    if (
      walletSpendingLimitVTokens?.isGreaterThan(0) &&
      fromAmountVTokens?.isGreaterThan(walletSpendingLimitVTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('liquidityHubForm.error.higherThanWalletSpendingLimit'),
      };
    }
  };

  const { mutateAsync: migrateCoreSupplyToLiquidityHub, isPending: isSubmitting } =
    useMigrateCoreSupplyToLiquidityHub();

  const handleSubmit = async (submittedFormValues: FormValues) => {
    const vTokenAmountMantissa = isMigratingFullCoreSupply
      ? userWalletVTokenBalanceMantissa
      : convertTokensToMantissa({
          token: corePoolAsset.vToken,
          value: new BigNumber(submittedFormValues.amountTokens).times(
            corePoolAsset.exchangeRateVTokens,
          ),
        });

    if (!vTokenAmountMantissa) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    await migrateCoreSupplyToLiquidityHub({
      vhToken: liquidityHub.vhToken,
      vToken: corePoolAsset.vToken,
      vTokenAmountMantissa,
    });
  };

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
          amountTokens: limitTokens.dp(liquidityHub.vhToken.underlyingToken.decimals).toFixed(),
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
