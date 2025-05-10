import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import {
  governorBravoDelegateAbi,
  useGetGovernorBravoDelegateContractAddress,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import type { Address, Hex } from 'viem';

export type CreateProposalInput = {
  targets: Address[];
  values: string[];
  signatures: string[];
  callDatas: Hex[];
  description: string;
  proposalType: 0 | 1 | 2;
};

type Options = UseSendTransactionOptions<CreateProposalInput>;

export const useCreateProposal = (options?: Partial<Options>) => {
  const governorBravoDelegateContractAddress = useGetGovernorBravoDelegateContractAddress();

  return useSendTransaction({
    fn: ({
      targets,
      values,
      signatures,
      callDatas,
      description,
      proposalType,
    }: CreateProposalInput) => {
      if (!governorBravoDelegateContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: governorBravoDelegateAbi,
        address: governorBravoDelegateContractAddress,
        functionName: 'propose',
        args: [targets, values.map(BigInt), signatures, callDatas, description, proposalType],
      };
    },
    onConfirmed: async () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PROPOSALS],
      });
    },
    options,
  });
};
