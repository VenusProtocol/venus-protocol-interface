import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { TransactionResponse } from './types';

const formatTransaction = ({
  amount,
  createdAt,
  updatedAt,
  category,
  event,
  vTokenAddress,
  ...rest
}: TransactionResponse) => {
  const token = getVTokenByAddress(vTokenAddress) || TOKENS.xvs;

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    vTokenAddress,
  };
};
export default formatTransaction;
