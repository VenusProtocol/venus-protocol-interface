import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { governorBravoDelegateAbi } from 'libs/contracts';
import { VError } from 'libs/errors';

type QueueProposalInput = {
  proposalId: number;
};

type Options = UseSendTransactionOptions<QueueProposalInput>;

export const useQueueProposal = (options?: Partial<Options>) => {
  const { address: governorBravoDelegateContractAddress } = useGetContractAddress({
    name: 'GovernorBravoDelegate',
  });

  return useSendTransaction({
    fn: ({ proposalId }: QueueProposalInput) => {
      if (!governorBravoDelegateContractAddress) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      return {
        abi: governorBravoDelegateAbi,
        address: governorBravoDelegateContractAddress,
        functionName: 'queue',
        args: [BigInt(proposalId)],
      };
    },
    onConfirmed: ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PROPOSALS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PROPOSAL,
          {
            id: input.proposalId,
          },
        ],
      });
    },
    options,
  });
};
