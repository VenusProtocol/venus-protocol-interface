import BigNumber from 'bignumber.js';
import { useSupplyTradePositionCollateral } from 'clients/api';

import { useTranslation } from 'libs/translations';
import { usePositionForm } from 'pages/Trade/OperationForm/usePositionForm';
import { type FormValues, PositionForm } from 'pages/Trade/PositionForm';
import type { AssetBalanceMutation, TradePosition } from 'types';
import { convertTokensToMantissa } from 'utilities';

export interface SupplyFormProps {
  position: TradePosition;
}

export const SupplyForm: React.FC<SupplyFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { formValues, setFormValues } = usePositionForm({ position });

  const { mutateAsync: supply, isPending: isSubmitting } = useSupplyTradePositionCollateral({
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
      label: t('trade.operationForm.openForm.collateral'),
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
      submitButtonLabel={t('trade.operationForm.supplyDsaForm.submitButtonLabel')}
    />
  );
};
