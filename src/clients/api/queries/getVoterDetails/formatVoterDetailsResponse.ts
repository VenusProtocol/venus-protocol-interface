import BigNumber from 'bignumber.js';
import { NULL_ADDRESS } from 'constants/address';
import { getSupportName } from 'utilities';
import { IVoterDetails, VoteDetailTransactionVote, VoteDetailTransactionTransfer } from 'types';
import { IGetVoterDetailsResponse } from './types';

const formatVoterResponse = (
  { balance, delegateCount, delegates, txs, votes }: IGetVoterDetailsResponse,
  address: string,
): IVoterDetails => ({
  balanceWei: new BigNumber(balance),
  delegateCount,
  delegates,
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
        if (type === 'vote' && 'support' in rest) {
          return {
            blockNumber,
            blockTimestamp: new Date(blockTimestamp * 1000),
            createdAt: new Date(createdAt),
            from,
            to,
            transactionHash,
            transactionIndex,
            type,
            support: getSupportName(rest.support),
            updatedAt: new Date(updatedAt),
            votesWei: new BigNumber(votes),
          } as VoteDetailTransactionVote;
        }
        return {
          amountWei: new BigNumber(rest.amount),
          blockNumber,
          blockTimestamp: new Date(blockTimestamp * 1000),
          createdAt: new Date(createdAt),
          from,
          to,
          transactionHash,
          transactionIndex,
          type,
          updatedAt: new Date(updatedAt),
          votesWei: new BigNumber(votes),
        } as VoteDetailTransactionTransfer;
      },
    )
    .slice(0, 3),
});

export default formatVoterResponse;
