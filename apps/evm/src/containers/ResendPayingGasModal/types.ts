import type { UseSendTransactionInput } from 'hooks/useSendTransaction';

export type LastFailedGaslessTransaction<TMutateInput extends Record<string, unknown> | void> =
  UseSendTransactionInput<TMutateInput, any, any, any> & {
    mutationInput: TMutateInput;
  };

export interface StoreState<TMutateInput extends Record<string, unknown> | void> {
  openModal: (input: {
    lastFailedGaslessTransaction: LastFailedGaslessTransaction<TMutateInput> | undefined;
  }) => void;
  closeModal: () => void;
  lastFailedGaslessTransaction: LastFailedGaslessTransaction<TMutateInput> | undefined;
}
