import BigNumber from 'bignumber.js';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress } from 'utilities';

import { VBEP_TOKENS } from 'constants/tokens';

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
  const vToken = vTokenAddress ? getVTokenByAddress(vTokenAddress) : VBEP_TOKENS.xvs;

  if (!vToken) {
    return undefined;
  }

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token: vToken?.underlyingToken }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    vTokenAddress,
  };
};
export default formatTransaction;
