export const getTokenListItemTestId = ({
  parentTestId,
  tokenAddress,
}: {
  parentTestId: string;
  tokenAddress: string;
}) => `${parentTestId}-token-select-button-${tokenAddress}`;
