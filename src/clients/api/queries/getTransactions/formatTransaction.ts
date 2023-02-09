import BigNumber from 'bignumber.js';
import config from 'config';
import { TransactionCategory, TransactionEvent } from 'types';
import { convertTokensToWei, getVTokenByAddress } from 'utilities';

import { xvs } from 'constants/contracts/addresses/vBepTokens.json';

import { TransactionResponse } from './types';

const MAIN_POOL_VXVS_ADDRESS = xvs[config.chainId];

const formatTransaction = ({
  amount,
  createdAt,
  updatedAt,
  category,
  event,
  vTokenAddress,
  ...rest
}: TransactionResponse) => {
  const vToken = getVTokenByAddress(vTokenAddress || MAIN_POOL_VXVS_ADDRESS);

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
