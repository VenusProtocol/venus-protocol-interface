import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getTokenByAddress, getVTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  amount,
  category,
  event,
  tokenAddress,
  timestamp,
  ...rest
}: TransactionResponse) => {
  const token =
    getTokenByAddress(tokenAddress) ||
    getVTokenByAddress(tokenAddress)?.underlyingToken ||
    TOKENS.xvs;

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token }),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    token,
    timestamp: new Date(timestamp * 1000), // Convert timestamp to milliseconds
  };
};
export default formatTransaction;
