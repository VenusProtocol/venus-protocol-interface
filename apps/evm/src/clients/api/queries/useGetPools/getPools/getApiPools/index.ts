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

interface ApiIntrinsicApyReward extends ApiReward {
  rewardType: 'intrinsic';
  rewardDetails: {
    name: string;
    description: string;
  };
}

type ApiOffChainApyReward = Omit<ApiIntrinsicApyReward, 'type'> & {
  rewardType: 'intrinsic';
};

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

export type ApiRewardDistributor =
  | ApiVenusReward
  | ApiMerklReward
  | ApiIntrinsicApyReward
  | ApiOffChainApyReward;

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

export interface ApiTokenPrice {
  tokenWrappedAddress: Address | null;
  priceMantissa: string;
  priceSource: 'oracle' | 'merkl' | 'coingecko';
  priceOracleAddress: Address | null;
  mainOracleName: string;
  mainOracleAddress: Address;
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

  const tokenMetadata = payload.tokens || [];
  const tokenPricesMapping: Record<Address, ApiTokenPrice[]> = tokenMetadata.reduce<{
    [address: string]: ApiTokenPrice[];
  }>((acc, tokenMetadata) => {
    const { address: tokenAddress, tokenPrices } = tokenMetadata;

    return {
      ...acc,
      [tokenAddress.toLowerCase()]: tokenPrices,
    };
  }, {});
  const pools = (payload?.result || []).map(pool => ({
    ...pool,
    markets: pool.markets.map(market => ({
      ...market,
      pointsDistributions: market.pointsDistributions.map(pd => formatPointDistribution(pd)),
    })),
  }));

  return {
    pools,
    tokenPricesMapping,
  };
};
