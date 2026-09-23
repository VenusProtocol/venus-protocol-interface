import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { AvailableBalance } from 'components';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, SpokeAsset, SpokePool, Token } from 'types';
import { calculateCollateralWithdrawLimits, formatTokensToReadableValue } from 'utilities';
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

  // Throws until VPD-2072 wires the contracts, so a submission is never reported as a success
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
