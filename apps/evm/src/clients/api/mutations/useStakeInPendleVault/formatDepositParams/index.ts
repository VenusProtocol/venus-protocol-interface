import type { PendleContractDepositCallParams } from 'clients/api';

export const formatDepositParams = (params: PendleContractDepositCallParams) => {
  if (!Array.isArray(params)) return params;

  const [, market, minPtOut, guessPtOut, input, limit] = params;

  return [
    market,
    BigInt(minPtOut),
    {
      ...guessPtOut,
      guessMin: BigInt(guessPtOut.guessMin),
      guessMax: BigInt(guessPtOut.guessMax),
      guessOffchain: BigInt(guessPtOut.guessOffchain),
      eps: BigInt(guessPtOut.eps),
      maxIteration: BigInt(guessPtOut.maxIteration),
    },
    {
      ...input,
      netTokenIn: BigInt(input.netTokenIn),
      swapData: {
        ...input.swapData,
        swapType: Number(input.swapData.swapType),
      },
    },
    {
      ...limit,
      epsSkipMarket: BigInt(limit.epsSkipMarket),
    },
  ] as const;
};
