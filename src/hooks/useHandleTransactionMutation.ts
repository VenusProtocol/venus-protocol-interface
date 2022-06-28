import type { TransactionReceipt } from 'web3-core/types';

import { VError, formatVErrorToReadableString } from 'errors';
import useSuccessfulTransactionModal, {
  OpenSuccessfulTransactionModalInput,
} from 'hooks/useSuccessfulTransactionModal';
import { toast } from 'components/v2/Toast';

export interface IHandleMutationInput {
  mutate: () => Promise<TransactionReceipt | void>;
  successTransactionModalProps: (
    transactionReceipt: TransactionReceipt,
  ) => OpenSuccessfulTransactionModalInput;
}

const useHandleTransactionMutation = () => {
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const handleMutation = async ({ mutate, successTransactionModalProps }: IHandleMutationInput) => {
    try {
      // Send request
      const transactionReceipt = await mutate();

      // Display successful transaction modal
      if (transactionReceipt) {
        const successfulTransactionModalProps = successTransactionModalProps(transactionReceipt);
        openSuccessfulTransactionModal(successfulTransactionModalProps);
      }
    } catch (error) {
      let { message } = error as Error;

      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }

      toast.error({
        message,
      });
    }
  };

  return handleMutation;
};

export default useHandleTransactionMutation;
