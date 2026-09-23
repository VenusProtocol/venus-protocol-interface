import type { ChainId, SpokeAsset, SpokePool, Token, TokenBalance } from 'types';
import { addUserBorrowLimitShares, areAddressesEqual, calculateUserPoolValues } from 'utilities';

import { formatToSpokeAsset } from '../formatToSpokeAsset';
import type { ApiSpokeAccountPool, ApiSpokePool } from '../types';

export interface FormatToSpokePoolInput {
  apiPool: ApiSpokePool;
  chainId: ChainId;
  tokens: Token[];
  isUserConnected: boolean;
  userAccountPool?: ApiSpokeAccountPool;
  userTokenBalances: TokenBalance[];
}

export const formatToSpokePool = ({
  apiPool,
  chainId,
  tokens,
  isUserConnected,
  userAccountPool,
  userTokenBalances,
}: FormatToSpokePoolInput): SpokePool => {
  const assets = apiPool.markets.reduce<SpokeAsset[]>((acc, apiMarket) => {
    const spokeAsset = formatToSpokeAsset({
      apiMarket,
      chainId,
      tokens,
      isUserConnected,
      userPosition: userAccountPool?.positions.find(position =>
        areAddressesEqual(position.marketAddress, apiMarket.address),
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
    isIsolated: true,
    eModeGroups: [],
    assets: assetsWithShares,
  };

  return spokePool;
};
