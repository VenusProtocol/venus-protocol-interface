import BigNumber from 'bignumber.js';
import { Token, TransactionCategory, TransactionEvent, VToken } from 'types';
import { convertTokensToWei, findTokenByAddress } from 'utilities';

import { TransactionResponse } from './types';

const formatTransaction = ({
  data: { amount, category, event, tokenAddress, timestamp, ...rest },
  vTokens,
  tokens,
  defaultToken,
}: {
  data: TransactionResponse;
  vTokens: VToken[];
  tokens: Token[];
  defaultToken: Token;
}) => {
  let token = tokenAddress
    ? findTokenByAddress({
        address: tokenAddress,
        tokens,
      })
    : undefined;

  if (!token) {
    token =
      (tokenAddress &&
        findTokenByAddress({
          address: tokenAddress,
          tokens: vTokens,
        })?.underlyingToken) ||
      defaultToken;
  }

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
