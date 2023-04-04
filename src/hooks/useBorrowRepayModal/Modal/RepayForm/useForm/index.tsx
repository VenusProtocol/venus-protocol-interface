import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'translation';
import { Asset, Swap } from 'types';
import { areTokensEqual, convertTokensToWei, convertWeiToTokens } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useIsMounted from 'hooks/useIsMounted';

import calculatePercentageOfUserBorrowBalance from '../calculatePercentageOfUserBorrowBalance';
import getValidationSchema, { FormValues } from './validationSchema';

export * from './validationSchema';

export interface UseFormProps {
  asset: Asset;
  onRepay: ({
    amountWei,
    isRepayingFullLoan,
  }: {
    amountWei: BigNumber;
    isRepayingFullLoan: boolean;
  }) => Promise<ContractReceipt>;
  onCloseModal: () => void;
  swap?: Swap;
}

const useForm = ({ asset, onRepay, onCloseModal, swap }: UseFormProps) => {
  const isMounted = useIsMounted();

  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const formikProps = useFormik<FormValues>({
    initialValues: {
      amountTokens: '',
      fromToken: asset.vToken.underlyingToken,
      fixedRepayPercentage: undefined,
    },
    onSubmit: async ({ amountTokens, fixedRepayPercentage }, formikHelpers) => {
      const amountWei = convertTokensToWei({
        value: new BigNumber(amountTokens.trim()),
        token: asset.vToken.underlyingToken,
      });

      const isRepayingFullLoan = fixedRepayPercentage === 100;

      await handleTransactionMutation({
        mutate: () =>
          onRepay({
            amountWei,
            isRepayingFullLoan,
          }),
        successTransactionModalProps: contractReceipt => ({
          title: t('borrowRepayModal.borrow.successfulTransactionModal.title'),
          content: t('borrowRepayModal.borrow.successfulTransactionModal.message'),
          amount: {
            valueWei: amountWei,
            token: asset.vToken.underlyingToken,
          },
          transactionHash: contractReceipt.transactionHash,
        }),
      });

      formikHelpers.resetForm();

      onCloseModal();
    },
    validateOnMount: true,
    validateOnChange: true,
    validationSchema: getValidationSchema({
      repayBalanceTokens: asset.userBorrowBalanceTokens.toFixed(),
      walletBalanceTokens: asset.userWalletBalanceTokens.toFixed(),
    }),
  });

  // If user selected a fixed percentage of their loan to repay, we manually
  // update the input value to that exact amount (and keep on updating when the
  // total loan value changes, for example when interests accumulate)
  useEffect(() => {
    // Handle repaying a fixed percentage without swapping
    const isNotSwapping = areTokensEqual(
      formikProps.values.fromToken,
      asset.vToken.underlyingToken,
    );

    if (isMounted() && formikProps.values.fixedRepayPercentage && isNotSwapping) {
      const fixedAmountToRepayTokens = calculatePercentageOfUserBorrowBalance({
        asset,
        percentage: formikProps.values.fixedRepayPercentage,
      });

      formikProps.setFieldValue('amountTokens', fixedAmountToRepayTokens);
    }

    // Handle repaying a fixed percentage using the swap
    if (
      isMounted() &&
      formikProps.values.fixedRepayPercentage &&
      swap?.direction === 'exactAmountOut'
    ) {
      const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
        valueWei: swap.expectedFromTokenAmountSoldWei,
        token: swap.fromToken,
      }).toFixed();

      formikProps.setFieldValue('amountTokens', expectedFromTokenAmountSoldTokens);
    }
  }, [formikProps.values.fixedRepayPercentage, formikProps.values.fromToken, asset, swap]);

  return formikProps;
};

export default useForm;
