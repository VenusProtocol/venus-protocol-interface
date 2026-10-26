import BigNumber from 'bignumber.js';

import type { SpokeAsset } from 'types';

export const getMinAmountTokens = ({ asset }: { asset: SpokeAsset }) =>
  new BigNumber(1)
    .shiftedBy(-asset.vToken.decimals)
    .dividedBy(asset.exchangeRateVTokens)
    .decimalPlaces(asset.vToken.underlyingToken.decimals, BigNumber.ROUND_UP);
