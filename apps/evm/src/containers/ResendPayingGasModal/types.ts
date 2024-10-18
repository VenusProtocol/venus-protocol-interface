import type { BaseContract } from 'ethers';
import type { UseSendTransactionInput } from 'hooks/useSendTransaction';

export type LastFailedGaslessTransaction<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
> = UseSendTransactionInput<TMutateInput, TContract, TMethodName> & {
  mutationInput: TMutateInput;
};

export interface StoreState<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
> {
  openModal: (input: {
    lastFailedGaslessTransaction:
      | LastFailedGaslessTransaction<TMutateInput, TContract, TMethodName>
      | undefined;
  }) => void;
  closeModal: () => void;
  lastFailedGaslessTransaction:
    | LastFailedGaslessTransaction<TMutateInput, TContract, TMethodName>
    | undefined;
}
