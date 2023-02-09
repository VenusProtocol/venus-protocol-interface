import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress, unsafelyGetToken } from 'utilities';

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
  const vToken = vTokenAddress && getVTokenByAddress(vTokenAddress);
  const token = (vToken && unsafelyGetToken(vToken.id)) || TOKENS.xvs;

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
