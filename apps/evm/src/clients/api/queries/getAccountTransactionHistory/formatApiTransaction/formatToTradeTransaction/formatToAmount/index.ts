import BigNumber from 'bignumber.js';

import type { Asset, TxAmount } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const formatToAmount = ({
  amountMantissa,
  asset,
}: {
  amountMantissa: string | bigint;
  asset: Asset;
}) => {
  const token = asset.vToken.underlyingToken;

  const amountTokens = convertMantissaToTokens({
    value: new BigNumber(amountMantissa),
    token,
  });

  const amountCents = amountTokens.multipliedBy(asset.tokenPriceCents).toNumber();

  const amount: TxAmount = {
    token,
    amountTokens,
    amountCents,
  };

  return amount;
};
