import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useGetSwapQuote } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useSimulateYieldPlusMutations } from 'hooks/useSimulateYieldPlusPositionMutations';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { getSwapToTokenAmountReceivedTokens } from 'utilities';
import { type FormValues, PositionForm } from '../../PositionForm';
import { useFormValidation } from '../../PositionForm/useFormValidation';

export interface FormProps {
  position: YieldPlusPosition;
}

export const Form: React.FC<FormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const [formValues, setFormValues] = useState<FormValues>({
    leverageFactor: position.leverageFactor,
    dsaToken: position.dsaAsset.vToken.underlyingToken,
    dsaAmountTokens: '',
    shortAmountTokens: '',
    acknowledgeRisk: false,
    acknowledgeHighPriceImpact: false,
  });

  const _debouncedDsaAmountTokens = useDebounceValue(formValues.dsaAmountTokens);
  const debouncedDsaAmountTokens = new BigNumber(_debouncedDsaAmountTokens || 0);

  const _debouncedShortAmountTokens = useDebounceValue(formValues.shortAmountTokens);
  const debouncedShortAmountTokens = new BigNumber(_debouncedShortAmountTokens || 0);

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.shortAsset.vToken.underlyingToken,
      fromTokenAmountTokens: debouncedShortAmountTokens,
      toToken: position.longAsset.vToken.underlyingToken,
      direction: 'exact-in',
      recipientAddress: relativePositionManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled:
        !!relativePositionManagerContractAddress && debouncedShortAmountTokens.isGreaterThan(0),
    },
  );
  const swapQuote = getSwapQuoteData?.swapQuote;

  const expectedLongAmountTokens = getSwapToTokenAmountReceivedTokens(swapQuote);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.dsaAsset.vToken.address,
      action: 'supply',
      amountTokens: new BigNumber(swapQuote ? debouncedDsaAmountTokens : 0),
      enableAsCollateralOfUser: true,
      label: t('yieldPlus.operationForm.openForm.collateral'),
    },
    {
      type: 'asset',
      vTokenAddress: position.longAsset.vToken.address,
      action: 'supply',
      amountTokens: new BigNumber(expectedLongAmountTokens || 0),
      enableAsCollateralOfUser: true,
      label: t('yieldPlus.operationForm.openForm.long'),
    },
    {
      type: 'asset',
      vTokenAddress: position.shortAsset.vToken.address,
      action: 'borrow',
      amountTokens: new BigNumber(swapQuote ? debouncedShortAmountTokens : 0),
      label: t('yieldPlus.operationForm.openForm.short'),
    },
  ];

  const { data: getSimulatedYieldPlusMutationsData } = useSimulateYieldPlusMutations({
    position,
    balanceMutations,
  });
  const simulatedPosition = getSimulatedYieldPlusMutationsData?.position;

  const limitShortTokens = debouncedDsaAmountTokens.isGreaterThan(0)
    ? debouncedDsaAmountTokens
        .multipliedBy(position.dsaAsset.tokenPriceCents)
        .multipliedBy(position.dsaAsset.collateralFactor)
        .multipliedBy(formValues.leverageFactor)
        .dividedBy(position.shortAsset.tokenPriceCents)
    : new BigNumber(0);

  // TODO: wire up

  const { formError } = useFormValidation({
    balanceMutations,
    position,
    simulatedPosition,
    formValues,
    swapQuoteErrorCode: getSwapQuoteError?.code,
    swapQuote,
  });

  return (
    <PositionForm
      formError={formError}
      swapQuote={swapQuote}
      isLoading={isGetSwapQuoteLoading}
      position={position}
      simulatedPosition={simulatedPosition}
      formValues={formValues}
      setFormValues={setFormValues}
      limitShortTokens={limitShortTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.openForm.submitButtonLabel')}
    />
  );
};
