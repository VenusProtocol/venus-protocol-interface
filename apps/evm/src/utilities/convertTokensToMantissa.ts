import type BigNumber from 'bignumber.js';

import type { Token } from 'types';

export const convertTokensToMantissa = ({ value, token }: { value: BigNumber; token: Token }) =>
  value.shiftedBy(token.decimals).dp(0);

export default convertTokensToMantissa;
