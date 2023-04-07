import BigNumber from 'bignumber.js';
import { VError } from 'errors';
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
  onSwapAndRepay: ({
    swap,
    isRepayingFullLoan,
  }: {
    swap: Swap;
    isRepayingFullLoan: boolean;
  }) => Promise<ContractReceipt>;
  onCloseModal: () => void;
  userBorrowBalanceTokens: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  swap?: Swap;
}

const useForm = ({
  toToken,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  userBorrowBalanceTokens,
  onRepay,
  onSwapAndRepay,
  onCloseModal,
  swap,
}: UseFormProps) => {
  const isMounted = useIsMounted();

  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const validationSchema = useGetValidationSchema({
    repayBalanceTokens: userBorrowBalanceTokens.toFixed(),
    walletBalanceTokens: fromTokenUserWalletBalanceTokens.toFixed(),
  });

  const formikProps = useFormik<FormValues>({
    initialValues: {
      amountTokens: '',
      fromToken: toToken,
      fixedRepayPercentage: undefined,
    },
    onSubmit: async ({ amountTokens, fixedRepayPercentage, fromToken }, formikHelpers) => {
      const isSwapping = !areTokensEqual(fromToken, toToken);
      const isRepayingFullLoan = fixedRepayPercentage === 100;
      let amountWei: BigNumber;

      await handleTransactionMutation({
        mutate: () => {
          // Throw an error if we're meant to execute a swap but no swap was
          // passed through props. This should never happen since the form is
          // disabled while swap infos are being fetched, but we add this logic
          // as a safeguard
          if (isSwapping && !swap) {
            throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
          }

          if (swap) {
            amountWei =
              swap?.direction === 'exactAmountIn'
                ? swap.expectedToTokenAmountReceivedWei
                : swap.toTokenAmountReceivedWei;
          } else {
            amountWei = convertTokensToWei({
              value: new BigNumber(amountTokens.trim()),
              token: fromToken,
            });
          }

          if (!swap) {
            return onRepay({
              isRepayingFullLoan,
              amountWei,
            });
          }

          return onSwapAndRepay({
            isRepayingFullLoan,
            swap,
          });
        },
        successTransactionModalProps: contractReceipt => ({
          title: t('borrowRepayModal.repay.successfulTransactionModal.title'),
          content: t('borrowRepayModal.repay.successfulTransactionModal.message'),
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
    formikProps.validateForm();
  }, [validationSchema]);

  // If user selected a fixed percentage of their loan to repay, we manually
  // update the input value to that exact amount (and keep on updating it when
  // the total loan value changes, for example when interests accumulate)
  useEffect(() => {
    // Fixed percentage without swapping
    const isNotSwapping = areTokensEqual(formikProps.values.fromToken, toToken);

    if (isMounted() && formikProps.values.fixedRepayPercentage && isNotSwapping) {
      const fixedAmountToRepayTokens = calculatePercentageOfUserBorrowBalance({
        userBorrowBalanceTokens,
        token: formikProps.values.fromToken,
        percentage: formikProps.values.fixedRepayPercentage,
      });

      formikProps.setFieldValue('amountTokens', fixedAmountToRepayTokens);
    }
  }, [
    formikProps.values.fixedRepayPercentage,
    formikProps.values.fromToken,
    toToken,
    userBorrowBalanceTokens,
  ]);

  useEffect(() => {
    // Fixed percentage using the swap
    const isSwapping = !!swap;

    if (
      isMounted() &&
      formikProps.values.fixedRepayPercentage &&
      isSwapping &&
      swap.direction === 'exactAmountOut'
    ) {
      const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
        valueWei: swap.expectedFromTokenAmountSoldWei,
        token: swap.fromToken,
      }).toFixed();

      formikProps.setFieldValue('amountTokens', expectedFromTokenAmountSoldTokens);
    }
  }, [formikProps.values.fixedRepayPercentage, swap]);

  return formikProps;
};

export default useForm;
