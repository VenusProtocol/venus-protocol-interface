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
  calculateCollateralWithdrawLimits,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
import { Form, type FormValues, initialFormValues } from '../Form';

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
  const [selectedAsset, setSelectedAsset] = useState(initialCollateral);
  const { accountAddress } = useAccountAddress();
  const { mutateAsync: withdraw, isPending: isSubmitting } = useWithdrawFromSpoke();

  const { data: getVTokenBalanceData } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: selectedAsset.vToken.address,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { decimals } = selectedAsset.vToken.underlyingToken;

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
          amountTokens: safeLimitTokens.dp(decimals).toFixed(),
        }))
    : undefined;

  const availableBalanceDom = (
    <AvailableBalance
      readableBalance={formatTokensToReadableValue({
        value: limitTokens,
        token: selectedAsset.vToken.underlyingToken,
      })}
      onClick={handleLimitClick}
    />
  );

  const handleSubmit = (submittedFormValues: FormValues) => {
    const amountTokens = new BigNumber(submittedFormValues.amountTokens);

    return withdraw({
      vToken: selectedAsset.vToken,
      poolName: spokePool.name,
      amountMantissa: convertTokensToMantissa({
        value: amountTokens,
        token: selectedAsset.vToken.underlyingToken,
      }),
      withdrawFullSupply: amountTokens.isEqualTo(selectedAsset.userSupplyBalanceTokens),
      vTokenBalanceMantissa: getVTokenBalanceData?.balanceMantissa,
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
    />
  );
};
