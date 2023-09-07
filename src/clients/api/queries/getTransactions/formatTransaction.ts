import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent, VToken } from 'types';
import { areAddressesEqual, convertTokensToWei, getTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  data: { amount, category, event, tokenAddress, timestamp, ...rest },
  vTokens,
}: {
  data: TransactionResponse;
  vTokens: VToken[];
}) => {
  let token = getTokenByAddress(tokenAddress);

  if (!token) {
    token =
      (tokenAddress &&
        vTokens.find(vToken => areAddressesEqual(vToken.address, tokenAddress))?.underlyingToken) ||
      TOKENS.xvs;
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
