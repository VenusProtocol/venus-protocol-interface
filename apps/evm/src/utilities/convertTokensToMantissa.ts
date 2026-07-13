import type BigNumber from 'bignumber.js';

import type { Token, VToken, VhToken } from 'types';

export const convertTokensToMantissa = ({
  value,
  token,
}: { value: BigNumber; token: Token | VToken | VhToken }) => value.shiftedBy(token.decimals).dp(0);

export default convertTokensToMantissa;
