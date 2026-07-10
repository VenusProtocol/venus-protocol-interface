export const calculateAmountDollars = ({
  tokenPriceCents,
  amountTokens,
}: {
  tokenPriceCents: BigNumber;
  amountTokens: BigNumber | string;
}) => (tokenPriceCents.toNumber() * Number(amountTokens)) / 100;
