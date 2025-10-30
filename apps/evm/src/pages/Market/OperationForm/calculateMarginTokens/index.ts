import BigNumber from 'bignumber.js';

export const calculateMarginTokens = ({
  balanceCents,
  limitCents,
  tokenPriceCents,
}: {
  balanceCents: BigNumber;
  limitCents: BigNumber;
  tokenPriceCents: BigNumber;
}) => {
  let marginTokens = limitCents
    .minus(balanceCents)
    // Convert to tokens
    .dividedBy(tokenPriceCents);

  if (marginTokens.isLessThan(0)) {
    marginTokens = new BigNumber(0);
  }

  return marginTokens;
};
