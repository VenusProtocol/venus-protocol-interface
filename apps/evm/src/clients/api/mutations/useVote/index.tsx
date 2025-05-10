import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import {
  governorBravoDelegateAbi,
  useGetGovernorBravoDelegateContractAddress,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import type { VoteSupport } from 'types';
import type { Account, Chain, WriteContractParameters } from 'viem';

export type CastVoteInput = {
  proposalId: number;
  voteType: VoteSupport;
  voteReason?: string;
};

type Options = UseSendTransactionOptions<CastVoteInput>;

export const useVote = (options?: Partial<Options>) => {
  const governorBravoDelegateContractAddress = useGetGovernorBravoDelegateContractAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    fn: ({ proposalId, voteType, voteReason }: CastVoteInput) => {
      if (!governorBravoDelegateContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (voteReason) {
        return {
          abi: governorBravoDelegateAbi,
          address: governorBravoDelegateContractAddress,
          functionName: 'castVoteWithReason',
          args: [BigInt(proposalId), voteType, voteReason],
        } as WriteContractParameters<
          typeof governorBravoDelegateAbi,
          'castVoteWithReason',
          readonly [bigint, number, string],
          Chain,
          Account
        >;
      }

      return {
        abi: governorBravoDelegateAbi,
        address: governorBravoDelegateContractAddress,
        functionName: 'castVote',
        args: [BigInt(proposalId), voteType],
      } as WriteContractParameters<
        typeof governorBravoDelegateAbi,
        'castVote',
        readonly [bigint, number],
        Chain,
        Account
      >;
    },
    onConfirmed: async ({ input }) => {
      const { proposalId, voteType } = input;

      captureAnalyticEvent('Vote cast', {
        proposalId,
        voteType: indexedVotingSupportNames[voteType],
      });

      // Invalidate query to fetch voters
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VOTERS,
          {
            id: proposalId,
            filter: voteType,
          },
        ],
      });

      // Invalidate queries to fetch user vote
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VOTE_RECEIPT,
          {
            proposalId,
            accountAddress,
          },
        ],
      });

      // Invalidate queries to fetch proposal
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_PROPOSALS] });
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
