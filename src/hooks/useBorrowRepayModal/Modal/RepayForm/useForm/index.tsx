import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useFormik } from 'formik';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { convertTokensToWei } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

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
  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const formikProps = useFormik<FormValues>({
    initialValues: {
      amountTokens: '',
      fromToken: asset.vToken.underlyingToken,
    },
    onSubmit: async ({ amountTokens }, formikHelpers) => {
      const amountWei = convertTokensToWei({
        value: new BigNumber(amountTokens.trim()),
        token: asset.vToken.underlyingToken,
      });

      const isRepayingFullLoan = amountWei.eq(
        convertTokensToWei({
          value: asset.userBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
        }),
      );

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

  return {
    formikProps,
  };
};

export default useForm;
