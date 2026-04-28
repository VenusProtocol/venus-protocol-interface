import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import type { Token } from 'types';

export const getAmountCents = ({
  amountTokens,
  token,
  tokenPriceMapping,
}: {
  amountTokens: BigNumber;
  token: Token;
  tokenPriceMapping: Record<Address, BigNumber>;
}) => {
  const priceCents = tokenPriceMapping[token.address.toLowerCase() as Address];
  const amountCents = amountTokens?.multipliedBy(priceCents);

  return amountCents;
};
