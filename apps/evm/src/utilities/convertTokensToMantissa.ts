import BigNumber from 'bignumber.js';

import { Token } from 'types';

export const convertTokensToMantissa = ({ value, token }: { value: BigNumber; token: Token }) =>
  value.multipliedBy(10 ** token.decimals).dp(0);

export default convertTokensToMantissa;
