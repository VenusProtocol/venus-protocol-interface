import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { convertTokensToWei } from 'utilities';

import getValidationSchema, { FormValues } from 'containers/AmountForm/validationSchema';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

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

  const limitTokens = useMemo(
    () =>
      asset
        ? BigNumber.min(asset.userBorrowBalanceTokens, asset.userWalletBalanceTokens).toString()
        : '0',
    [asset?.userBorrowBalanceTokens, asset?.userWalletBalanceTokens],
  );

  const formikProps = useFormik<FormValues>({
    initialValues: {
      amount: '',
    },
    onSubmit: async ({ amount: amountTokens }) => {
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

      // TODO: handle swap and repay flow (see VEN-1272)

      await handleTransactionMutation({
        mutate: async () =>
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

      onCloseModal();
    },
    validateOnMount: true,
    validateOnChange: true,
    validationSchema: getValidationSchema(limitTokens),
  });

  return {
    formikProps,
    limitTokens,
  };
};

export default useForm;
