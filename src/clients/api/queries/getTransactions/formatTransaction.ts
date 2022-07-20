import BigNumber from 'bignumber.js';
import { TokenId, TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getTokenIdFromVAddress } from 'utilities';

import { XVS_TOKEN_ID } from 'constants/xvs';

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
  const tokenId = vTokenAddress ? (getTokenIdFromVAddress(vTokenAddress) as TokenId) : XVS_TOKEN_ID;
  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), tokenId }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    vTokenAddress,
  };
};
export default formatTransaction;
