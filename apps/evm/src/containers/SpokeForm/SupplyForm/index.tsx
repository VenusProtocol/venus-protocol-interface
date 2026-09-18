import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { AvailableBalance } from 'components';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, SpokeAsset, SpokePool, Token } from 'types';
import { clampToZero, formatTokensToReadableValue } from 'utilities';
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
    .filter(asset => !asset.disabledTokenActions.includes('supply'))
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

  // Supply approves the CollateralGateway rather than the market, so the approval step waits for
  // that contract's address in VPD-2072 along with the transaction itself
  const handleSubmit = async (_submittedFormValues: FormValues) => {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  };

  return (
    <Form
      spokePool={spokePool}
      token={selectedAsset.vToken.underlyingToken}
      isSubmitting={false}
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
    />
  );
};
