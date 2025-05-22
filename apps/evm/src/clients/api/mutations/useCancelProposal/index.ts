import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { governorBravoDelegateAbi } from 'libs/contracts';
import { VError } from 'libs/errors';

type CancelProposalInput = {
  proposalId: number;
};

type Options = UseSendTransactionOptions<CancelProposalInput>;

export const useCancelProposal = (options?: Partial<Options>) => {
  const { address: governorBravoDelegateContractAddress } = useGetContractAddress({
    name: 'GovernorBravoDelegate',
  });

  return useSendTransaction({
    fn: ({ proposalId }: CancelProposalInput) => {
      if (!governorBravoDelegateContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: governorBravoDelegateAbi,
        address: governorBravoDelegateContractAddress,
        functionName: 'cancel',
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
