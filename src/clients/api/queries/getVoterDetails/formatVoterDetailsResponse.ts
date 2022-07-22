import BigNumber from 'bignumber.js';
import { VoteDetailTransactionTransfer, VoteDetailTransactionVote, VoterDetails } from 'types';

import { NULL_ADDRESS } from 'constants/address';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

import { GetVoterDetailsResponse } from './types';

const formatVoterResponse = (
  { balance, delegateCount, delegates, txs, votes }: GetVoterDetailsResponse,
  address: string,
): VoterDetails => ({
  balanceWei: new BigNumber(balance),
  delegateCount,
  delegateAddress: delegates,
  delegating: delegates !== NULL_ADDRESS && delegates.toLowerCase() !== address.toLowerCase(),
  votesWei: new BigNumber(votes),
  voterTransactions: txs
    .map(
      ({
        blockNumber,
        blockTimestamp,
        createdAt,
        from,
        to,
        transactionHash,
        transactionIndex,
        type,
        updatedAt,
        ...rest
      }) => {
        const voteBase = {
          blockNumber,
          blockTimestamp: new Date(blockTimestamp * 1000),
          createdAt: new Date(createdAt),
          from,
          to,
          transactionHash,
          transactionIndex,
          updatedAt: new Date(updatedAt),
          votesWei: new BigNumber(votes),
        };
        if (type === 'vote' && 'support' in rest) {
          const transactionVote: VoteDetailTransactionVote = {
            ...voteBase,
            type: 'vote',
            support: indexedVotingSupportNames[rest.support],
          };
          return transactionVote;
        }
        const transactionTransfer: VoteDetailTransactionTransfer = {
          ...voteBase,
          type: 'transfer',
          amountWei: new BigNumber(rest.amount),
        };
        return transactionTransfer;
      },
    )
    .slice(0, 3),
});

export default formatVoterResponse;
