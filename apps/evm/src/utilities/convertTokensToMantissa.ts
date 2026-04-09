import type BigNumber from 'bignumber.js';

import type { Token, VToken } from 'types';

export const convertTokensToMantissa = ({
  value,
  token,
}: { value: BigNumber; token: Token | VToken }) => value.shiftedBy(token.decimals).dp(0);

export default convertTokensToMantissa;
