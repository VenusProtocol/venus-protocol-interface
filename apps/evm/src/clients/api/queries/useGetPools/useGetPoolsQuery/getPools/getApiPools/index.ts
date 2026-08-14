import { VError } from 'libs/errors';
import type { ApiPointsDistribution, ApiRewardDistributor, ApiTokenPrice, ChainId } from 'types';
import { restService } from 'utilities/restService';
import type { Address } from 'viem';
import { formatPointDistribution } from './pointDistributions';

export interface ApiMarketEModeSettings {
  marketAddress: Address;
  canBeCollateral: boolean;
  isBorrowable: boolean;
  collateralFactorMantissa: string;
  liquidationIncentiveMantissa: string;
  liquidationThresholdMantissa: string;
  poolId: number;
}

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
  liquidationIncentiveMantissa: string;
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
  badDebtMantissa: string;
  estimatedPrimeBorrowApyBoost: string | null;
  estimatedPrimeSupplyApyBoost: string | null;
  pausedActionsBitmap: number;
  isListed: boolean;
  supplierCount: number | null;
  borrowerCount: number | null;
  poolComptrollerAddress: Address;
  rewardsDistributors: ApiRewardDistributor[];
  pointsDistributions: ApiPointsDistribution[];
  isBorrowable?: boolean;
  eModeSettings?: ApiMarketEModeSettings[];
}

export interface ApiEModeGroup {
  poolId: number;
  label: string;
  comptrollerAddress: Address;
  allowCorePoolFallback: boolean;
  isActive: boolean;
  eModeSettings: ApiMarketEModeSettings[];
}

export interface ApiPool {
  address: Address;
  name: string;
  markets: ApiMarket[];
  priceOracleAddress: Address;
  eModeGroups?: ApiEModeGroup[];
}

export interface ApiTokenMetadata {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  tokenPrices: ApiTokenPrice[];
  gatedCountries?: string[];
  restrictedCountries?: string[];
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
        exception: 'Could not fetch pools from API',
      },
    });
  }

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        exception: payload.error,
      },
    });
  }

  const tokenMetadatas = payload.tokens || [];
  const tokenMetadataMapping = tokenMetadatas.reduce<{
    [address: string]: ApiTokenMetadata;
  }>(
    (acc, tokenMetadata) => ({
      ...acc,
      [tokenMetadata.address.toLowerCase()]: tokenMetadata,
    }),
    {},
  );

  const pools = (payload?.result || []).map(pool => ({
    ...pool,
    markets: pool.markets.map(market => ({
      ...market,
      pointsDistributions: market.pointsDistributions.map(pd => formatPointDistribution(pd)),
    })),
  }));

  return {
    pools,
    tokenMetadataMapping,
  };
};
