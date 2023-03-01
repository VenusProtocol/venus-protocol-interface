import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress } from 'utilities';

import { VBEP_TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  amount,
  category,
  event,
  vTokenAddress,
  timestamp,
  ...rest
}: TransactionResponse) => {
  const vToken = vTokenAddress ? getVTokenByAddress(vTokenAddress) : VBEP_TOKENS.xvs;

  if (!vToken) {
    return undefined;
  }

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token: vToken?.underlyingToken }),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    vTokenAddress: vToken.address,
    timestamp: new Date(timestamp * 1000), // Convert timestamp to milliseconds
  };
};
export default formatTransaction;
