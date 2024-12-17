import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities/restService';

export interface ApiRewardDistributor {
  marketAddress: string;
  rewardTokenAddress: string;
  lastRewardingSupplyBlockOrTimestamp: string;
  lastRewardingBorrowBlockOrTimestamp: string;
  supplySpeed: string;
  borrowSpeed: string;
  priceMantissa: string;
  rewardsDistributorContractAddress: string | null;
}

export interface ApiMarket {
  address: string;
  symbol: string;
  name: string;
  underlyingAddress: string | null;
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
  underlyingPriceMantissa: string;
  totalBorrowsMantissa: string;
  totalSupplyMantissa: string;
  cashMantissa: string;
  totalReservesMantissa: string;
  reserveFactorMantissa: string;
  collateralFactorMantissa: string;
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
  borrowerCount: number;
  supplierCount: number;
  estimatedPrimeBorrowApyBoost: string | null;
  estimatedPrimeSupplyApyBoost: string | null;
  pausedActionsBitmap: number;
  isListed: boolean;
  poolComptrollerAddress: string;
  rewardsDistributors: ApiRewardDistributor[];
}

export interface ApiPool {
  address: string;
  name: string;
  markets: ApiMarket[];
}

export interface GetApiPoolsResponse {
  result: ApiPool[];
  request: { addresses: string[] };
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

  return {
    pools: payload?.result || [],
  };
};
