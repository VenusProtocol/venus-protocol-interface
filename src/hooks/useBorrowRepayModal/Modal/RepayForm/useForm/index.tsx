import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { convertTokensToWei } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useIsMounted from 'hooks/useIsMounted';

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
}

const useForm = ({ asset, onRepay, onCloseModal }: UseFormProps) => {
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
    if (isMounted() && formikProps.values.fixedRepayPercentage) {
      const fixedAmountToRepayTokens = asset.userBorrowBalanceTokens
        .multipliedBy(formikProps.values.fixedRepayPercentage / 100)
        .decimalPlaces(asset.vToken.underlyingToken.decimals)
        .toFixed();

      formikProps.setFieldValue('amountTokens', fixedAmountToRepayTokens);
    }
  }, [formikProps.values.fixedRepayPercentage, asset.userBorrowBalanceTokens]);

  return formikProps;
};

export default useForm;
