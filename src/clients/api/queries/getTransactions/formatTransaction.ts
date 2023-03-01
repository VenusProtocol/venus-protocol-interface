import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress, unsafelyGetToken } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  amount,
  category,
  event,
  vTokenAddress,
  timestamp,
  ...rest
}: TransactionResponse) => {
  const vToken = vTokenAddress && getVTokenByAddress(vTokenAddress);
  const token = (vToken && unsafelyGetToken(vToken.id)) || TOKENS.xvs;

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token }),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    timestamp: new Date(timestamp * 1000), // Convert timestamp to milliseconds
    vTokenAddress,
  };
};
export default formatTransaction;
