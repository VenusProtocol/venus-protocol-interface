import BigNumber from 'bignumber.js';

import { useGetSwapQuote } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useTranslation } from 'libs/translations';
import { type FormValues, PositionForm } from 'pages/YieldPlus/OperationForm/PositionForm';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { useEffect } from 'react';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { getSwapToTokenAmount } from 'utilities';

export interface ReduceFormProps {
  position: YieldPlusPosition;
}

export const ReduceForm: React.FC<ReduceFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position });

  const _debouncedLongAmountTokens = useDebounceValue(formValues.longAmountTokens);
  const debouncedLongAmountTokens = new BigNumber(_debouncedLongAmountTokens || 0);

  const shortAmountTokens = new BigNumber(formValues.shortAmountTokens || 0);

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const limitLongTokens = BigNumber.min(position.longBalanceTokens, position.longAsset.cashTokens);

  const {
    data: getActionSwapQuoteData,
    error: getActionSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.longAsset.vToken.underlyingToken,
      fromTokenAmountTokens: debouncedLongAmountTokens,
      toToken: position.shortAsset.vToken.underlyingToken,
      direction: 'exact-in',
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && debouncedLongAmountTokens.isGreaterThan(0),
    },
  );
  const actionSwapQuote = getActionSwapQuoteData?.swapQuote;

  // TODO: fetch profit/loss swap quote based on the results of the first one

  // Update short amount when swap quote is fetched
  useEffect(() => {
    const expectedShortAmountTokens = getSwapToTokenAmount(actionSwapQuote);

    if (expectedShortAmountTokens) {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        shortAmountTokens: expectedShortAmountTokens.toFixed(),
      }));
    }
  }, [setFormValues, actionSwapQuote]);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.longAsset.vToken.address,
      action: 'withdraw',
      amountTokens: new BigNumber(actionSwapQuote ? debouncedLongAmountTokens : 0),
      enableAsCollateralOfUser: true,
      label: t('yieldPlus.operationForm.openForm.long'),
    },
    {
      type: 'asset',
      vTokenAddress: position.shortAsset.vToken.address,
      action: 'repay',
      amountTokens: new BigNumber(actionSwapQuote ? shortAmountTokens : 0),
      label: t('yieldPlus.operationForm.openForm.short'),
    },
  ];

  const handleSubmit = async (_formValues: FormValues) => {
    // TODO: submit transaction
  };

  // TODO: calculate and display PnL

  const isSubmitting = false; // TODO wire up

  return (
    <PositionForm
      action="reduce"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      actionSwapQuote={actionSwapQuote}
      actionSwapQuoteErrorCode={getActionSwapQuoteError?.code}
      isLoading={isGetSwapQuoteLoading}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitLongTokens={limitLongTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.reduceForm.submitButtonLabel')}
    />
  );
};
