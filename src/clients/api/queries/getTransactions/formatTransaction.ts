import BigNumber from 'bignumber.js';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { TransactionCategory, TransactionEvent, TokenId } from 'types';
import { getTokenIdFromVAddress } from 'utilities';
import { convertCoinsToWei } from 'utilities/common';
import { ITransactionResponse } from './types';

const formatTransaction = ({
  amount,
  createdAt,
  updatedAt,
  category,
  event,
  vTokenAddress,
  ...rest
}: ITransactionResponse) => {
  const tokenId = vTokenAddress ? (getTokenIdFromVAddress(vTokenAddress) as TokenId) : XVS_TOKEN_ID;
  return {
    ...rest,
    amountWei: convertCoinsToWei({ value: new BigNumber(amount), tokenId }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    vTokenAddress,
  };
};
export default formatTransaction;
