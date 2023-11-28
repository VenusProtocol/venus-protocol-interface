import BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import { Voter } from 'types';

import { GetVoterDetailsResponse } from './types';

const formatVoterResponse = (
  { balance, delegateCount, delegates, txs, votes }: GetVoterDetailsResponse,
  address: string,
): Voter => ({
  balanceMantissa: new BigNumber(balance),
  delegateCount,
  delegateAddress: delegates,
  delegating: delegates !== NULL_ADDRESS && delegates.toLowerCase() !== address.toLowerCase(),
  votesMantissa: new BigNumber(votes),
  txs: txs.map(({ amountMantissa, timestamp, ...rest }) => {
    const voteTransaction = {
      amountMantissa: new BigNumber(amountMantissa),
      timestamp: new Date(timestamp),
      ...rest,
    };
    return voteTransaction;
  }),
});

export default formatVoterResponse;
