import BigNumber from 'bignumber.js';
import { useSupplyYieldPlusPositionCollateral } from 'clients/api';

import { useTranslation } from 'libs/translations';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { type FormValues, PositionForm } from 'pages/YieldPlus/PositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { convertTokensToMantissa } from 'utilities';

export interface SupplyFormProps {
  position: YieldPlusPosition;
}

export const SupplyForm: React.FC<SupplyFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { formValues, setFormValues } = usePositionForm({ position });

  const { mutateAsync: supply, isPending: isSubmitting } = useSupplyYieldPlusPositionCollateral({
    waitForConfirmation: true,
  });

  const dsaAmountTokens = new BigNumber(formValues.dsaAmountTokens || 0);

  const handleSubmit = async (formValues: FormValues) => {
    const amountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber(formValues.dsaAmountTokens),
        token: position.dsaAsset.vToken.underlyingToken,
      }).toFixed(0),
    );

    await supply({
      shortVTokenAddress: position.shortAsset.vToken.address,
      longVTokenAddress: position.longAsset.vToken.address,
      amountMantissa,
    });
  };

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.dsaAsset.vToken.address,
      action: 'supply',
      amountTokens: dsaAmountTokens,
      balanceTokens: position.dsaBalanceTokens,
      label: t('yieldPlus.operationForm.openForm.collateral'),
    },
  ];

  return (
    <PositionForm
      action="supplyDsa"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitDsaTokens={position.dsaAsset.userWalletBalanceTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.supplyDsaForm.submitButtonLabel')}
    />
  );
};
