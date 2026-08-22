import BigNumber from 'bignumber.js';
import {
  useGetProportionalCloseTolerancePercentage,
  useWithdrawYieldPlusPositionCollateral,
} from 'clients/api';

import { useTranslation } from 'libs/translations';
import { calculateUnusedCollateralCents } from 'pages/YieldPlus/OperationForm/calculateUnusedCollateralCents';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { type FormValues, PositionForm } from 'pages/YieldPlus/PositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { convertTokensToMantissa } from 'utilities';

export interface WithdrawFormProps {
  position: YieldPlusPosition;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { formValues, setFormValues } = usePositionForm({ position });

  const { mutateAsync: withdraw, isPending: isSubmitting } = useWithdrawYieldPlusPositionCollateral(
    {
      waitForConfirmation: true,
    },
  );

  const dsaAmountTokens = new BigNumber(formValues.dsaAmountTokens || 0);

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

  const unusedCollateralCents = proportionalCloseTolerancePercentage
    ? calculateUnusedCollateralCents({
        dsaAmountTokens: position.dsaBalanceTokens,
        dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
        dsaTokenCollateralFactor: position.dsaAsset.userCollateralFactor,
        longAmountTokens: position.longBalanceTokens,
        longTokenPriceCents: position.longAsset.tokenPriceCents,
        longTokenCollateralFactor: position.longAsset.userCollateralFactor,
        shortAmountTokens: position.shortBalanceTokens,
        shortTokenPriceCents: position.shortAsset.tokenPriceCents,
        leverageFactor: position.leverageFactor,
        proportionalCloseTolerancePercentage,
      })
    : undefined;

  const limitDsaTokens = unusedCollateralCents
    ?.dividedBy(position.dsaAsset.tokenPriceCents)
    .dp(position.dsaAsset.vToken.underlyingToken.decimals);

  const handleSubmit = async (formValues: FormValues) => {
    const amountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber(formValues.dsaAmountTokens),
        token: position.dsaAsset.vToken.underlyingToken,
      }).toFixed(0),
    );

    await withdraw({
      shortVTokenAddress: position.shortAsset.vToken.address,
      longVTokenAddress: position.longAsset.vToken.address,
      amountMantissa,
    });
  };

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.dsaAsset.vToken.address,
      action: 'withdraw',
      amountTokens: dsaAmountTokens,
      balanceTokens: position.dsaBalanceTokens,
      label: t('yieldPlus.operationForm.openForm.collateral'),
    },
  ];

  return (
    <PositionForm
      action="withdrawDsa"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitDsaTokens={limitDsaTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.withdrawDsaForm.submitButtonLabel')}
    />
  );
};
