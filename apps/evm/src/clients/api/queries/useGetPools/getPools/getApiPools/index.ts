import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities/restService';
import type { Address } from 'viem';
import { formatPointDistribution } from './pointDistributions';

interface ApiReward {
  marketAddress: Address;
  rewardTokenAddress: Address;
  lastRewardingSupplyBlockOrTimestamp: string;
  lastRewardingBorrowBlockOrTimestamp: string;
  supplySpeed: string;
  borrowSpeed: string;
  rewardsDistributorContractAddress: Address;
  isActive: boolean;
}

interface ApiVenusReward extends ApiReward {
  rewardType: 'venus';
  rewardDetails: null;
}

interface ApiMerklReward extends ApiReward {
  rewardType: 'merkl';
  rewardDetails: {
    appName: string;
    claimUrl: string;
    merklCampaignId: string;
    description: string;
    merklCampaignIdentifier: string;
    tags: string[];
  };
}

export type PointsProgram = 'ethena' | 'etherfi' | 'kelp' | 'solv' | 'aster';

export interface ApiPointsDistribution {
  action: 'supply' | 'borrow';
  pointsProgram: PointsProgram;
  title: string;
  incentive?: string;
  description?: string;
  extraInfoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  logoUrl?: string;
}

export type ApiRewardDistributor = ApiVenusReward | ApiMerklReward;

export interface ApiMarket {
  address: Address;
  symbol: string;
  name: string;
  underlyingAddress: Address;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimal: number;
  borrowerDailyXvsMantissa: string | null;
  supplierDailyXvsMantissa: string | null;
  xvsBorrowIndex: string | null;
  xvsSupplyIndex: string | null;
  borrowRatePerBlock: string;
  supplyRatePerBlock: string;
  exchangeRateMantissa: string;
  totalBorrowsMantissa: string;
  totalSupplyMantissa: string;
  cashMantissa: string;
  totalReservesMantissa: string;
  reserveFactorMantissa: string;
  collateralFactorMantissa: string;
  liquidationThresholdMantissa: string;
  borrowApy: string;
  supplyApy: string;
  borrowXvsApr: string | null;
  supplyXvsApr: string | null;
  liquidityCents: string;
  tokenPriceCents: string;
  totalDistributedMantissa: string | null;
  lastCalculatedXvsAccruedBlockNumber: string | null;
  supplyCapsMantissa: string;
  borrowCapsMantissa: string;
  estimatedPrimeBorrowApyBoost: string | null;
  estimatedPrimeSupplyApyBoost: string | null;
  pausedActionsBitmap: number;
  isListed: boolean;
  supplierCount: number | null;
  borrowerCount: number | null;
  poolComptrollerAddress: Address;
  rewardsDistributors: ApiRewardDistributor[];
  pointsDistributions: ApiPointsDistribution[];
}

export interface ApiPool {
  address: Address;
  name: string;
  markets: ApiMarket[];
  priceOracleAddress: Address;
}

export interface ApiTokenPrice {
  tokenWrappedAddress: Address | null;
  priceMantissa: string;
  priceSource: 'oracle' | 'merkl' | 'coingecko';
  priceOracleAddress: Address | null;
  isPriceInvalid: boolean;
  hasErrorFetchingPrice: boolean;
}

export interface ApiTokenMetadata {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  tokenPrices: ApiTokenPrice[];
}

export interface GetApiPoolsResponse {
  result: ApiPool[];
  tokens: ApiTokenMetadata[];
  request: { addresses: Address[] };
}

export const getApiPools = async ({
  chainId,
}: {
  chainId: ChainId;
}) => {
  const response = await restService<GetApiPoolsResponse>({
    endpoint: '/pools',
    method: 'GET',
    params: {
      chainId,
    },
  });

  const payload = response.data;

  if (!payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        message: 'Could not fetch pools from API',
      },
    });
  }

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        message: payload.error,
      },
    });
  }

  const tokenMetadata = payload.tokens || [];
  const pools = (payload?.result || []).map(pool => ({
    ...pool,
    markets: pool.markets.map(market => ({
      ...market,
      pointsDistributions: market.pointsDistributions.map(pd => formatPointDistribution(pd)),
    })),
  }));

  return {
    pools,
    tokenMetadata,
  };
};
