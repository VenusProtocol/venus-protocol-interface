import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import {
  getGovernorBravoDelegateContractAddress,
  getOmnichainGovernanceExecutorContractAddress,
  governorBravoDelegateAbi,
  omnichainGovernanceExecutorAbi,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { governanceChain } from 'libs/wallet';
import type { ChainId } from 'types';

type ExecuteProposalInput = {
  chainId: ChainId;
  proposalId: number;
};

type Options = UseSendTransactionOptions<ExecuteProposalInput>;

export const useExecuteProposal = (options?: Partial<Options>) => {
  return useSendTransaction({
    fn: ({ proposalId, chainId }: ExecuteProposalInput) => {
      const address =
        chainId === governanceChain.id
          ? getGovernorBravoDelegateContractAddress({
              chainId,
            })
          : getOmnichainGovernanceExecutorContractAddress({
              chainId,
            });

      if (!address) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        address,
        abi:
          chainId === governanceChain.id
            ? governorBravoDelegateAbi
            : omnichainGovernanceExecutorAbi,
        functionName: 'execute',
        args: [BigInt(proposalId)],
      };
    },
    onConfirmed: async ({ input }) => {
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

