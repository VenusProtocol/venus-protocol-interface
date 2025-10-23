import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import {
  getContractAddress,
  governorBravoDelegateAbi,
  omnichainGovernanceExecutorAbi,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { governanceChainId } from 'libs/wallet';
import type { ChainId } from 'types';

type ExecuteProposalInput = {
  chainId: ChainId;
  proposalId: number;
};

type Options = UseSendTransactionOptions<ExecuteProposalInput>;

export const useExecuteProposal = (options?: Partial<Options>) => {
  return useSendTransaction({
    fn: ({ proposalId, chainId }: ExecuteProposalInput) => {
      const address = getContractAddress({
        name:
          chainId === governanceChainId ? 'GovernorBravoDelegate' : 'OmnichainGovernanceExecutor',
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
          chainId === governanceChainId ? governorBravoDelegateAbi : omnichainGovernanceExecutorAbi,
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
