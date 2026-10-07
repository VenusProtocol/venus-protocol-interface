import type { ChainId, SpokeAsset, SpokePool, Token, TokenBalance } from 'types';
import { addUserBorrowLimitShares, areAddressesEqual, calculateUserPoolValues } from 'utilities';

import { formatToSpokeAsset } from '../formatToSpokeAsset';
import type { ApiSpokePool, ApiSpokeToken, SpokeUserPosition } from '../types';

export interface FormatToSpokePoolInput {
  apiPool: ApiSpokePool;
  chainId: ChainId;
  tokens: Token[];
  isUserConnected: boolean;
  isUserDataUnavailable: boolean;
  userPositions: SpokeUserPosition[];
  userTokenBalances: TokenBalance[];
  apiTokens: ApiSpokeToken[];
}

export const formatToSpokePool = ({
  apiPool,
  chainId,
  tokens,
  isUserConnected,
  isUserDataUnavailable,
  userPositions,
  userTokenBalances,
  apiTokens,
}: FormatToSpokePoolInput): SpokePool => {
  const assets = apiPool.markets.reduce<SpokeAsset[]>((acc, apiMarket) => {
    const spokeAsset = formatToSpokeAsset({
      apiMarket,
      chainId,
      tokens,
      isUserConnected,
      priceOracleAddress: apiPool.priceOracleAddress ?? undefined,
      oraclePrice: apiTokens
        .find(
          apiToken =>
            !!apiMarket.underlyingAddress &&
            areAddressesEqual(apiToken.address, apiMarket.underlyingAddress),
        )
        ?.tokenPrices?.find(
          tokenPrice =>
            !!tokenPrice.priceOracleAddress &&
            !!apiPool.priceOracleAddress &&
            areAddressesEqual(tokenPrice.priceOracleAddress, apiPool.priceOracleAddress),
        ),
      userPosition: userPositions.find(position =>
        areAddressesEqual(position.vTokenAddress, apiMarket.address),
      ),
      userTokenBalances,
    });

    return spokeAsset ? [...acc, spokeAsset] : acc;
  }, []);

  const userPoolValues = calculateUserPoolValues({ assets });

  const { assets: assetsWithShares } = addUserBorrowLimitShares({
    assets,
    userBorrowLimitCents: userPoolValues.userBorrowLimitCents,
  });

  const spokePool: SpokePool = {
    ...userPoolValues,
    comptrollerAddress: apiPool.address,
    name: apiPool.name ?? '',
    description: apiPool.description ?? '',
    isUserDataUnavailable,
    isIsolated: true,
    eModeGroups: [],
    assets: assetsWithShares,
  };

  return spokePool;
};
