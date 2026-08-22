import BigNumber from 'bignumber.js';

import {
  useGetProportionalCloseTolerancePercentage,
  useGetSwapQuote,
  useOpenYieldPlusPosition,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { useEffect } from 'react';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { areTokensEqual, convertTokensToMantissa, getSwapToTokenAmount } from 'utilities';
import { type FormValues, PositionForm } from '../../../PositionForm';
import { calculateMaxBorrowShortTokens } from '../../calculateMaxBorrowShortTokens';
import { usePositionForm } from '../../usePositionForm';

export interface FormProps {
  position: YieldPlusPosition;
}

export const Form: React.FC<FormProps> = ({ position: newPosition }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position: newPosition });

  const { mutateAsync: openYieldPlusPosition, isPending: isSubmitting } = useOpenYieldPlusPosition({
    waitForConfirmation: true,
  });

  const {
    data: { dsaAssets },
  } = useGetYieldPlusAssets();

  // The DSA asset from the position is static, so we manually update the position based on the
  // selected DSA token and leverage factor
  const position: YieldPlusPosition = {
    ...newPosition,
    leverageFactor: formValues.leverageFactor,
    dsaAsset:
      newPosition.pool.assets.find(asset =>
        areTokensEqual(asset.vToken.underlyingToken, formValues.dsaToken),
      ) || newPosition.dsaAsset,
  };

  const _debouncedDsaAmountTokens = useDebounceValue(formValues.dsaAmountTokens);
  const debouncedDsaAmountTokens = new BigNumber(_debouncedDsaAmountTokens || 0);

  const _debouncedLongAmountTokens = useDebounceValue(formValues.longAmountTokens);
  const debouncedLongAmountTokens = new BigNumber(_debouncedLongAmountTokens || 0);

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
    const expectedLongAmountTokens = getSwapToTokenAmount(swapQuote);

    if (expectedLongAmountTokens) {
      setFormValues(currentFormValues => {
        const isFormIncomplete =
          new BigNumber(currentFormValues.dsaAmountTokens || 0).isZero() ||
          new BigNumber(currentFormValues.shortAmountTokens || 0).isZero();

        return {
          ...currentFormValues,
          longAmountTokens: isFormIncomplete ? '' : expectedLongAmountTokens.toFixed(),
        };
      });
    }
  }, [setFormValues, swapQuote]);

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
      amountTokens: new BigNumber(swapQuote ? debouncedLongAmountTokens : 0),
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

  const limitShortTokens =
    typeof proportionalCloseTolerancePercentage === 'number'
      ? calculateMaxBorrowShortTokens({
          dsaAmountTokens: debouncedDsaAmountTokens,
          dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
          dsaTokenCollateralFactor: position.dsaAsset.collateralFactor,
          longAmountTokens: new BigNumber(0),
          longTokenPriceCents: position.longAsset.tokenPriceCents,
          longTokenCollateralFactor: position.longAsset.collateralFactor,
          shortAmountTokens: new BigNumber(0),
          shortTokenPriceCents: position.shortAsset.tokenPriceCents,
          leverageFactor: formValues.leverageFactor,
          shortTokenDecimals: position.shortAsset.vToken.underlyingToken.decimals,
          proportionalCloseTolerancePercentage,
        })
      : new BigNumber(0);

  const handleSubmit = async (formValues: FormValues) => {
    const initialPrincipalMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber(formValues.dsaAmountTokens),
        token: formValues.dsaToken,
      }).toFixed(),
    );

    if (swapQuote?.direction !== 'exact-in') {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    const dsaIndex = dsaAssets.findIndex(dsaAsset =>
      areTokensEqual(dsaAsset.vToken.underlyingToken, formValues.dsaToken),
    );

    if (dsaIndex < 0) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return openYieldPlusPosition({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      dsaIndex,
      initialPrincipalMantissa,
      leverageFactor: formValues.leverageFactor,
      swapQuote,
    });
  };

  return (
    <PositionForm
      action="open"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      repaySwapQuote={swapQuote}
      repaySwapQuoteErrorCode={getSwapQuoteError?.code}
      isLoading={isGetSwapQuoteLoading}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitShortTokens={limitShortTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.openForm.submitButtonLabel')}
    />
  );
};
