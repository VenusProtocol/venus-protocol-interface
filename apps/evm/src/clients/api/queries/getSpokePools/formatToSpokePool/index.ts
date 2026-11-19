import type { ChainId, SpokeAsset, SpokePool, Token, TokenBalance } from 'types';
import { addUserBorrowLimitShares, areAddressesEqual, calculateUserPoolValues } from 'utilities';

import { formatToSpokeAsset } from '../formatToSpokeAsset';
import type { ApiSpokePool, ApiSpokeToken, SpokeUserPosition } from '../types';
import { formatToSpokePoolInfoTags } from './formatToSpokePoolInfoTags';

export interface FormatToSpokePoolInput {
  apiPool: ApiSpokePool;
  chainId: ChainId;
  tokens: Token[];
  isUserConnected: boolean;
  isUserDataUnavailable: boolean;
  userPositions: SpokeUserPosition[];
  userTokenBalances: TokenBalance[];
  apiTokens: ApiSpokeToken[];
  supplyAllowlistStatus?: Record<string, boolean>;
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
  supplyAllowlistStatus = {},
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
      isUserWhitelisted: !!supplyAllowlistStatus[apiMarket.address.toLowerCase()],
    });

    return spokeAsset ? [...acc, spokeAsset] : acc;
  }, []);

  const userPoolValues = calculateUserPoolValues({ assets });

  const { assets: assetsWithShares } = addUserBorrowLimitShares({
    assets,
    userBorrowLimitCents: userPoolValues.userBorrowLimitCents,
  });

  const collateralMarkets = apiPool.markets.filter(
    apiMarket => apiMarket.isListed && apiMarket.side === 'collateral',
  );

  const spokePool: SpokePool = {
    ...userPoolValues,
    comptrollerAddress: apiPool.address,
    name: apiPool.name ?? '',
    description: apiPool.description ?? '',
    isUserDataUnavailable,
    isIsolated: true,
    eModeGroups: [],
    assets: assetsWithShares,
    infoTags: formatToSpokePoolInfoTags(apiPool.tags),
    hasWhitelist:
      collateralMarkets.length > 0 &&
      collateralMarkets.every(apiMarket => apiMarket.supplyAllowlistEnabled),
    isUserWhitelisted: assetsWithShares.some(asset => asset.isUserWhitelisted),
  };

  return spokePool;
};
