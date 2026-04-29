import BigNumber from 'bignumber.js';

import {
  useGetProportionalCloseTolerancePercentage,
  useGetSwapQuote,
  useIncreaseYieldPlusPosition,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { calculateMaxBorrowShortTokens } from 'pages/YieldPlus/OperationForm/calculateMaxBorrowShortTokens';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { type FormValues, PositionForm } from 'pages/YieldPlus/PositionForm';
import { useEffect } from 'react';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { convertTokensToMantissa, getSwapToTokenAmount } from 'utilities';

export interface IncreaseFormProps {
  position: YieldPlusPosition;
}

export const IncreaseForm: React.FC<IncreaseFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position });

  const { mutateAsync: increaseYieldPlusPosition, isPending: isSubmitting } =
    useIncreaseYieldPlusPosition({
      waitForConfirmation: true,
    });

  const longAmountTokens = new BigNumber(formValues.longAmountTokens || 0);

  const _debouncedShortAmountTokens = useDebounceValue(formValues.shortAmountTokens);
  const debouncedShortAmountTokens = new BigNumber(_debouncedShortAmountTokens || 0);

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

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

  // Update long amount when swap quote is fetched
  useEffect(() => {
    if (swapQuote) {
      const expectedLongAmountTokens = getSwapToTokenAmount(swapQuote);

      if (expectedLongAmountTokens) {
        setFormValues(currentFormValues => ({
          ...currentFormValues,
          longAmountTokens: expectedLongAmountTokens.toFixed(),
        }));
      }
    }
  }, [setFormValues, swapQuote]);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.longAsset.vToken.address,
      action: 'supply',
      balanceTokens: position.longBalanceTokens,
      amountTokens: new BigNumber(swapQuote ? longAmountTokens : 0),
      enableAsCollateralOfUser: true,
      label: t('yieldPlus.operationForm.openForm.long'),
    },
    {
      type: 'asset',
      vTokenAddress: position.shortAsset.vToken.address,
      action: 'borrow',
      balanceTokens: position.shortBalanceTokens,
      amountTokens: new BigNumber(swapQuote ? debouncedShortAmountTokens : 0),
      label: t('yieldPlus.operationForm.openForm.short'),
    },
  ];

  const limitShortTokens =
    typeof proportionalCloseTolerancePercentage === 'number'
      ? calculateMaxBorrowShortTokens({
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
          proportionalCloseTolerancePercentage,
        })
      : new BigNumber(0);

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

    return increaseYieldPlusPosition({
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
      action="increase"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      repaySwapQuote={swapQuote}
      swapQuoteError={getSwapQuoteError ?? undefined}
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
