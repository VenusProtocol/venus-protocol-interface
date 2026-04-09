import BigNumber from 'bignumber.js';
import type { PendleContractWithdrawCallParams } from 'clients/api';
import type { PendleFillOrderParams } from 'clients/api/queries/getPendleSwapQuote/types';
import type { Token, VToken } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

const formatFillOrderParams = (fills: PendleFillOrderParams[]) =>
  fills.map(({ order, signature, makingAmount }) => ({
    order: {
      ...order,
      salt: BigInt(order.salt),
      expiry: BigInt(order.expiry),
      nonce: BigInt(order.nonce),
      orderType: Number(order.orderType),
      makingAmount: BigInt(order.makingAmount),
      lnImpliedRate: BigInt(order.lnImpliedRate),
      failSafeRate: BigInt(order.failSafeRate),
    },
    signature,
    makingAmount: BigInt(makingAmount),
  }));

export const formatWithdrawParams = (
  params: PendleContractWithdrawCallParams,
  { fromToken, vToken }: { fromToken: Token; vToken: VToken },
) => {
  if (!Array.isArray(params)) return params;

  const [, pendleMarket, tokenAmount, input, limit] = params;

  // The API handles underlying Token transfer quote, but the SC requres vToken amount instead, so there will be a conversion between the two and this is intentional.
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
