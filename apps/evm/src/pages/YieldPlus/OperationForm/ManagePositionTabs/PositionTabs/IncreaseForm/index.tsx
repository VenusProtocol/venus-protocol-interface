import BigNumber from 'bignumber.js';

import { useGetSwapQuote, useScaleYieldPlusPosition } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { type FormValues, PositionForm } from 'pages/YieldPlus/OperationForm/PositionForm';
import { calculateMaxBorrowShortTokens } from 'pages/YieldPlus/OperationForm/calculateMaxBorrowShortTokens';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { convertTokensToMantissa, getSwapToTokenAmountReceivedTokens } from 'utilities';

export interface IncreaseFormProps {
  position: YieldPlusPosition;
}

export const IncreaseForm: React.FC<IncreaseFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position });

  const { mutateAsync: scaleYieldPlusPosition, isPending: isSubmitting } =
    useScaleYieldPlusPosition();

  const _debouncedShortAmountTokens = useDebounceValue(formValues.shortAmountTokens);
  const debouncedShortAmountTokens = new BigNumber(_debouncedShortAmountTokens || 0);

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
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
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && debouncedShortAmountTokens.isGreaterThan(0),
    },
  );
  const swapQuote = getSwapQuoteData?.swapQuote;

  const expectedLongAmountTokens = getSwapToTokenAmountReceivedTokens(swapQuote);

  const balanceMutations: AssetBalanceMutation[] = [
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

  const limitShortTokens = calculateMaxBorrowShortTokens({
    dsaAmountTokens: position.dsaBalanceTokens,
    dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
    dsaTokenCollateralFactor: position.dsaAsset.collateralFactor,
    longAmountTokens: position.longBalanceTokens,
    longTokenPriceCents: position.longAsset.tokenPriceCents,
    longTokenCollateralFactor: position.longAsset.collateralFactor,
    shortAmountTokens: position.shortBalanceTokens,
    shortTokenPriceCents: position.shortAsset.tokenPriceCents,
    leverageFactor: position.leverageFactor,
    shortTokenDecimals: position.shortAsset.vToken.underlyingToken.decimals,
  });

  const handleSubmit = async (formValues: FormValues) => {
    const shortAmountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber(formValues.shortAmountTokens),
        token: position.shortAsset.vToken.underlyingToken,
      }).toFixed(),
    );

    if (swapQuote?.direction !== 'exact-in') {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return scaleYieldPlusPosition({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      additionalPrincipalMantissa: 0n,
      shortAmountMantissa,
      minLongAmountMantissa: swapQuote.minimumToTokenAmountReceivedMantissa,
      swapQuote,
    });
  };

  return (
    <PositionForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      swapQuote={swapQuote}
      swapQuoteErrorCode={getSwapQuoteError?.code}
      isLoading={isGetSwapQuoteLoading}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitShortTokens={limitShortTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.increaseForm.submitButtonLabel')}
    />
  );
};
