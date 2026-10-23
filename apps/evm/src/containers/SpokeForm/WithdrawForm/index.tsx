import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useGetVTokenBalance, useWithdrawFromSpoke } from 'clients/api';
import { AvailableBalance } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, SpokeAsset, SpokePool, Token } from 'types';
import {
  areAddressesEqual,
  calculateCollateralWithdrawLimits,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';
import type { UseFormValidationInput } from '../Form/useForm/useFormValidation';
import { getMinAmountTokens } from '../getMinAmountTokens';

export interface WithdrawFormProps {
  spokePool: SpokePool;
  collaterals: SpokeAsset[];
  initialCollateral: SpokeAsset;
  onSubmitSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({
  spokePool,
  collaterals,
  initialCollateral,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(
    initialCollateral.vToken.underlyingToken.address,
  );
  const { accountAddress } = useAccountAddress();
  const { mutateAsync: withdraw, isPending: isSubmitting } = useWithdrawFromSpoke();

  const selectedAsset =
    collaterals.find(asset =>
      areAddressesEqual(asset.vToken.underlyingToken.address, selectedTokenAddress),
    ) ?? initialCollateral;

  const { refetch: refetchVTokenBalance } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: selectedAsset.vToken.address,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { limitTokens, safeLimitTokens } = calculateCollateralWithdrawLimits({
    asset: selectedAsset,
    pool: spokePool,
  });

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: selectedAsset.vToken.address,
      amountTokens: formValues.amountTokens
        ? new BigNumber(formValues.amountTokens)
        : new BigNumber(0),
      action: 'withdraw',
    },
  ];

  const tokenBalances: OptionalTokenBalance[] = collaterals.map(asset => ({
    token: asset.vToken.underlyingToken,
    balanceTokens: asset.userSupplyBalanceTokens,
  }));

  const handleChangeSelectedToken = (token: Token) => {
    setSelectedTokenAddress(token.address);
    setFormValues(initialFormValues);
  };

  const validateForm: UseFormValidationInput['validate'] = ({ formValues: { amountTokens } }) => {
    if (selectedAsset.disabledTokenActions.includes('withdraw')) {
      return {
        code: 'ACTION_DISABLED',
        message: t('assetAccessor.disabledActionNotice.withdraw'),
      };
    }

    const minAmountTokens = getMinAmountTokens({ asset: selectedAsset });

    if (
      new BigNumber(amountTokens).isGreaterThan(0) &&
      new BigNumber(amountTokens).isLessThan(minAmountTokens) &&
      !new BigNumber(amountTokens).isEqualTo(selectedAsset.userSupplyBalanceTokens)
    ) {
      return {
        code: 'LOWER_THAN_MIN_AMOUNT',
        message: t('spokeForm.error.lowerThanMinAmount', {
          minAmount: `${minAmountTokens.toFixed()} ${selectedAsset.vToken.underlyingToken.symbol}`,
        }),
      };
    }
  };

  const availableBalanceDom = (
    <AvailableBalance
      readableBalance={formatTokensToReadableValue({
        value: limitTokens,
        token: selectedAsset.vToken.underlyingToken,
      })}
    />
  );

  const handleSubmit = async (submittedFormValues: FormValues) => {
    const amountTokens = new BigNumber(submittedFormValues.amountTokens);
    const withdrawFullSupply = amountTokens.isEqualTo(selectedAsset.userSupplyBalanceTokens);

    const vTokenBalanceMantissa = withdrawFullSupply
      ? (await refetchVTokenBalance()).data?.balanceMantissa
      : undefined;

    return withdraw({
      vToken: selectedAsset.vToken,
      poolName: spokePool.name,
      amountMantissa: convertTokensToMantissa({
        value: amountTokens,
        token: selectedAsset.vToken.underlyingToken,
      }),
      withdrawFullSupply,
      vTokenBalanceMantissa,
    });
  };

  return (
    <Form
      spokePool={spokePool}
      token={selectedAsset.vToken.underlyingToken}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      submitButtonLabel={t('spokeForm.withdraw.submitButtonLabel')}
      rightMaxButtonLabel={t('spokeForm.safeMaxButtonLabel')}
      limitTokens={limitTokens}
      safeLimitTokens={safeLimitTokens}
      availableBalance={availableBalanceDom}
      tokenBalances={tokenBalances}
      onChangeSelectedToken={handleChangeSelectedToken}
      validateForm={validateForm}
    />
  );
};
