import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useSupplyToSpoke } from 'clients/api';
import { AvailableBalance } from 'components';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, SpokeAsset, SpokePool, Token } from 'types';
import { clampToZero, convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';

export interface SupplyFormProps {
  spokePool: SpokePool;
  collaterals: SpokeAsset[];
  initialCollateral: SpokeAsset;
  onSubmitSuccess?: () => void;
}

export const SupplyForm: React.FC<SupplyFormProps> = ({
  spokePool,
  collaterals,
  initialCollateral,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedAsset, setSelectedAsset] = useState(initialCollateral);
  const { mutateAsync: supply, isPending: isSubmitting } = useSupplyToSpoke();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  const { decimals } = selectedAsset.vToken.underlyingToken;

  const remainingCapacityTokens = clampToZero({
    value: selectedAsset.supplyCapTokens.minus(selectedAsset.supplyBalanceTokens),
  });

  const limitTokens = BigNumber.min(
    selectedAsset.userWalletBalanceTokens,
    remainingCapacityTokens,
  ).dp(decimals);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: selectedAsset.vToken.address,
      amountTokens: formValues.amountTokens
        ? new BigNumber(formValues.amountTokens)
        : new BigNumber(0),
      action: 'supply',
      // Supplying collateral to a spoke pool always enters the market
      enableAsCollateralOfUser: true,
    },
  ];

  const tokenBalances: OptionalTokenBalance[] = collaterals
    .filter(asset => !asset.isInactive && !asset.disabledTokenActions.includes('supply'))
    .map(asset => ({
      token: asset.vToken.underlyingToken,
      balanceTokens: asset.userWalletBalanceTokens,
    }));

  const handleChangeSelectedToken = (token: Token) => {
    const newAsset = collaterals.find(
      asset => asset.vToken.underlyingToken.address === token.address,
    );

    if (newAsset) {
      setSelectedAsset(newAsset);
      setFormValues(initialFormValues);
    }
  };

  const handleLimitClick = limitTokens.isGreaterThan(0)
    ? () =>
        setFormValues(values => ({
          ...values,
          amountTokens: limitTokens.toFixed(),
        }))
    : undefined;

  const validateForm = () =>
    selectedAsset.disabledTokenActions.includes('supply')
      ? { code: 'ACTION_DISABLED' as const, message: t('spokeForm.error.supplyDisabled') }
      : undefined;

  const availableBalanceDom = (
    <AvailableBalance
      label={t('spokeForm.supply.walletBalanceLabel')}
      readableBalance={formatTokensToReadableValue({
        value: selectedAsset.userWalletBalanceTokens,
        token: selectedAsset.vToken.underlyingToken,
      })}
      onClick={handleLimitClick}
    />
  );

  const handleSubmit = (submittedFormValues: FormValues) =>
    supply({
      vToken: selectedAsset.vToken,
      poolName: spokePool.name,
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(submittedFormValues.amountTokens),
        token: selectedAsset.vToken.underlyingToken,
      }),
    });

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
      submitButtonLabel={t('spokeForm.supply.submitButtonLabel')}
      limitTokens={limitTokens}
      availableBalance={availableBalanceDom}
      tokenBalances={tokenBalances}
      onChangeSelectedToken={handleChangeSelectedToken}
      validateForm={validateForm}
      approval={
        collateralGatewayAddress && {
          type: 'token',
          token: selectedAsset.vToken.underlyingToken,
          spenderAddress: collateralGatewayAddress,
        }
      }
    />
  );
};
