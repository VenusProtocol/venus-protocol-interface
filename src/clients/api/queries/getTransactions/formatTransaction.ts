import BigNumber from 'bignumber.js';
import { Token, TransactionCategory, TransactionEvent, VToken } from 'types';
import { findTokenByAddress, getTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  data: { amountMantissa, category, event, tokenAddress, timestamp, from, ...rest },
  vTokens,
}: {
  data: TransactionResponse;
  vTokens: VToken[];
}) => {
  // check if the tokenAddress is from a VToken
  const vToken = findTokenByAddress({
    address: tokenAddress || '',
    tokens: vTokens,
  });

  // if it is, use the VToken decimals and the image from the underlying token
  const transactionToken: Token | undefined = vToken
    ? { ...vToken.underlyingToken, decimals: vToken.decimals }
    : // else get the token from tokenAddress
      getTokenByAddress(tokenAddress);

  // if neither is found, use XVS
  const token = transactionToken || TOKENS.xvs;

  return {
    ...rest,
    amountMantissa: new BigNumber(amountMantissa),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    token,
    from,
    timestamp: new Date(timestamp * 1000), // Convert timestamp to milliseconds
  };
};

export default formatTransaction;
