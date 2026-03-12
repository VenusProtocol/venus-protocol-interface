import BigNumber from 'bignumber.js';

import { useGetSwapQuote } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useTranslation } from 'libs/translations';
import { type FormValues, PositionForm } from 'pages/YieldPlus/OperationForm/PositionForm';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { getSwapToTokenAmount } from 'utilities';

export interface ReduceFormProps {
  position: YieldPlusPosition;
}

export const ReduceForm: React.FC<ReduceFormProps> = ({ position }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position });

  const _debouncedShortAmountTokens = useDebounceValue(formValues.shortAmountTokens);
  const debouncedShortAmountTokens = new BigNumber(_debouncedShortAmountTokens || 0);

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  console.log(position.currentRatio, position.entryRatio);

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.longAsset.vToken.underlyingToken,
      fromTokenAmountTokens: debouncedShortAmountTokens,
      toToken: position.longAsset.vToken.underlyingToken,
      direction: 'exact-in', // TODO: use approximate-out swap
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && debouncedShortAmountTokens.isGreaterThan(0),
    },
  );
  const swapQuote = getSwapQuoteData?.swapQuote;

  const expectedLongAmountTokens = getSwapToTokenAmount(swapQuote);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.longAsset.vToken.address,
      action: 'withdraw',
      amountTokens: new BigNumber(expectedLongAmountTokens || 0),
      enableAsCollateralOfUser: true,
      label: t('yieldPlus.operationForm.openForm.long'),
    },
    {
      type: 'asset',
      vTokenAddress: position.shortAsset.vToken.address,
      action: 'repay',
      amountTokens: new BigNumber(swapQuote ? debouncedShortAmountTokens : 0),
      label: t('yieldPlus.operationForm.openForm.short'),
    },
  ];

  const handleSubmit = async (_formValues: FormValues) => {
    // TODO: submit transaction
  };

  // TODO: calculate and display PnL

  const limitShortTokens = BigNumber.minimum(
    position.shortBalanceTokens,
    position.shortAsset.cashTokens,
  );

  const isSubmitting = false; // TODO wire up

  return (
    <PositionForm
      action="reduce"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      actionSwapQuote={swapQuote}
      actionSwapQuoteErrorCode={getSwapQuoteError?.code}
      isLoading={isGetSwapQuoteLoading}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitShortTokens={limitShortTokens}
      balanceMutations={balanceMutations}
      submitButtonLabel={t('yieldPlus.operationForm.reduceForm.submitButtonLabel')}
    />
  );
};
