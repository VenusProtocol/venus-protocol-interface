import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'translation';
import { Swap, Token } from 'types';
import { areTokensEqual, convertTokensToWei, convertWeiToTokens } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useIsMounted from 'hooks/useIsMounted';

import calculatePercentageOfUserBorrowBalance from '../calculatePercentageOfUserBorrowBalance';
import useGetValidationSchema, { FormValues } from './validationSchema';

export * from './validationSchema';

export interface UseFormProps {
  toToken: Token;
  onRepay: ({
    amountWei,
    isRepayingFullLoan,
  }: {
    amountWei: BigNumber;
    isRepayingFullLoan: boolean;
  }) => Promise<ContractReceipt>;
  onCloseModal: () => void;
  userBorrowBalanceTokens: BigNumber;
  userWalletBalanceFromTokens?: BigNumber;
  swap?: Swap;
}

const useForm = ({
  toToken,
  userWalletBalanceFromTokens = new BigNumber(0),
  userBorrowBalanceTokens,
  onRepay,
  onCloseModal,
  swap,
}: UseFormProps) => {
  const isMounted = useIsMounted();

  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const validationSchema = useGetValidationSchema({
    swap,
    repayBalanceTokens: userBorrowBalanceTokens.toFixed(),
    walletBalanceTokens: userWalletBalanceFromTokens.toFixed(),
  });

  const formikProps = useFormik<FormValues>({
    initialValues: {
      amountTokens: '',
      fromToken: toToken,
      fixedRepayPercentage: undefined,
    },
    onSubmit: async ({ amountTokens, fixedRepayPercentage, fromToken }, formikHelpers) => {
      const amountWei = convertTokensToWei({
        value: new BigNumber(amountTokens.trim()),
        token: fromToken,
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
            token: toToken,
          },
          transactionHash: contractReceipt.transactionHash,
        }),
      });

      formikHelpers.resetForm();

      onCloseModal();
    },
    validateOnMount: true,
    validateOnChange: true,
    validationSchema,
  });

  // Revalidate form when validation schema changes, as it is based on swap
  // which itself changes based on form values
  useEffect(() => {
    // TODO: check if still needed (perhaps when changing fromToken for swap)
    formikProps.validateForm();
  }, [validationSchema]);

  // If user selected a fixed percentage of their loan to repay, we manually
  // update the input value to that exact amount (and keep on updating when the
  // total loan value changes, for example when interests accumulate)
  useEffect(() => {
    // Handle repaying a fixed percentage without swapping
    const isNotSwapping = areTokensEqual(formikProps.values.fromToken, toToken);

    if (isMounted() && formikProps.values.fixedRepayPercentage && isNotSwapping) {
      const fixedAmountToRepayTokens = calculatePercentageOfUserBorrowBalance({
        userBorrowBalanceTokens,
        token: formikProps.values.fromToken,
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
  }, [
    formikProps.values.fixedRepayPercentage,
    formikProps.values.fromToken,
    toToken,
    userBorrowBalanceTokens,
    swap,
  ]);

  return formikProps;
};

export default useForm;
