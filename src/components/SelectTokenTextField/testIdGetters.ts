export const getTokenTextFieldTestId = ({ parentTestId }: { parentTestId: string }) =>
  `${parentTestId}-token-text-field`;

export const getTokenSelectButtonTestId = ({ parentTestId }: { parentTestId: string }) =>
  `${parentTestId}-token-select-button`;

export const getTokenListItemTestId = ({
  parentTestId,
  tokenAddress,
}: {
  parentTestId: string;
  tokenAddress: string;
}) => `${parentTestId}-token-select-button-${tokenAddress}`;
