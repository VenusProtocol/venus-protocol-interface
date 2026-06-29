import BigNumber from 'bignumber.js';

import type { Asset, Token } from 'types';
import { areAddressesEqual, convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

export interface CalculatePrimeRewardCentsInput {
  amountMantissa: BigNumber.Value;
  marketAddress: Address;
  token: Token;
  assets: Asset[];
  fallbackCents: number;
}

export const calculatePrimeRewardCents = ({
  amountMantissa,
  marketAddress,
  token,
  assets,
  fallbackCents,
}: CalculatePrimeRewardCentsInput): number => {
  const asset = assets.find(poolAsset =>
    areAddressesEqual(poolAsset.vToken.address, marketAddress),
  );
  const amountTokens = convertMantissaToTokens({ value: new BigNumber(amountMantissa), token });

  if (!asset || !amountTokens) {
    return fallbackCents;
  }

  return amountTokens.multipliedBy(asset.tokenPriceCents).toNumber();
};
