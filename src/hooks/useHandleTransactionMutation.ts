import { displayMutationError } from 'errors';
import { ContractReceipt } from 'ethers';

import useSuccessfulTransactionModal, {
  OpenSuccessfulTransactionModalInput,
} from 'hooks/useSuccessfulTransactionModal';

export interface HandleMutationInput {
  mutate: () => Promise<ContractReceipt | void>;
  successTransactionModalProps: (
    contractReceipt: ContractReceipt,
  ) => OpenSuccessfulTransactionModalInput;
}

const useHandleTransactionMutation = () => {
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const handleMutation = async ({ mutate, successTransactionModalProps }: HandleMutationInput) => {
    try {
      // Send request
      const contractReceipt = await mutate();

      // Display successful transaction modal
      if (contractReceipt) {
        const successfulTransactionModalProps = successTransactionModalProps(contractReceipt);
        openSuccessfulTransactionModal(successfulTransactionModalProps);
      }
    } catch (error) {
      displayMutationError({
        error,
      });
    }
  };

  return handleMutation;
};

export default useHandleTransactionMutation;
