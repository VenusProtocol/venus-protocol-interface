import BigNumber from 'bignumber.js';
import type { PendleContractWithdrawCallParams } from 'clients/api';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { convertTokensToMantissa } from 'utilities/convertTokensToMantissa';

import type { PendlePtVaultWithdrawInput } from '../types';
import { formatFillOrderParams } from './formatFillOrderParams';

export const formatWithdrawParams = ({
  params,
  fromToken,
  vToken,
}: {
  params: PendleContractWithdrawCallParams;
  fromToken: PendlePtVaultWithdrawInput['fromToken'];
  vToken: NonNullable<PendlePtVaultWithdrawInput['vToken']>;
}) => {
  const [, pendleMarket, tokenAmount, input, limit] = params;

  const amountTokens = convertMantissaToTokens({
    value: new BigNumber(tokenAmount),
    token: fromToken,
  });

  const vTokenMantissa = convertTokensToMantissa({
    value: amountTokens,
    token: vToken,
  });

  return [
    pendleMarket,
    BigInt(vTokenMantissa.toFixed(0, 1)),
    {
      ...input,
      minTokenOut: BigInt(input.minTokenOut),
      swapData: {
        ...input.swapData,
        swapType: Number(input.swapData.swapType),
      },
    },
    {
      ...limit,
      epsSkipMarket: BigInt(limit.epsSkipMarket),
      normalFills: formatFillOrderParams(limit.normalFills),
      flashFills: formatFillOrderParams(limit.flashFills),
    },
  ] as const;
};
