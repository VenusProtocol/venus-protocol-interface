import BigNumber from 'bignumber.js';
import { NULL_ADDRESS } from 'constants/address';

import type { Market, Token } from 'types';
import { convertMantissaToTokens, restService } from 'utilities';

export interface ApiMarket {
  address: string;
  symbol: string;
  name: string;
  underlyingAddress: string | undefined;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimal: number;
  borrowerDailyXvsMantissa: string;
  supplierDailyXvsMantissa: string;
  xvsBorrowIndex: string;
  xvsSupplyIndex: string;
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
  borrowXvsApr: string;
  supplyXvsApr: string;
  liquidityCents: string;
  tokenPriceCents: string;
  totalDistributedMantissa: string;
  lastCalculatedXvsAccruedBlockNumber: number;
  supplyCapsMantissa: string;
  borrowCapsMantissa: string;
  borrowerCount: number;
  supplierCount: number;
  xvsSupplySpeed: string;
  xvsBorrowSpeed: string;
  estimatedPrimeBorrowApyBoost: string | undefined;
  estimatedPrimeSupplyApyBoost: string | undefined;
  pausedActionsBitmap: number;
  isListed: boolean;
}

export interface GetLegacyPoolMarketsResponse {
  result: ApiMarket[];
  request: { addresses: string[] };
}

export interface GetLegacyPoolMarketsInput {
  xvs: Token;
}

export interface GetLegacyPoolMarketsOutput {
  markets: Market[];
}

const getLegacyPoolMarkets = async ({
  xvs,
}: GetLegacyPoolMarketsInput): Promise<GetLegacyPoolMarketsOutput> => {
  const response = await restService<GetLegacyPoolMarketsResponse>({
    endpoint: '/markets/core-pool',
    method: 'GET',
    params: {
      limit: 50,
      isListed: 1,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new Error(payload.error);
  }

  const markets: Market[] = (payload?.result || []).map(apiMarket => {
    const totalXvsDistributedTokens = apiMarket.totalDistributedMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(apiMarket.totalDistributedMantissa),
          token: xvs,
        })
      : new BigNumber(0);

    return {
      address: apiMarket.address,
      borrowerCount: apiMarket.borrowerCount,
      supplierCount: apiMarket.supplierCount,
      supplyApyPercentage: new BigNumber(apiMarket.supplyApy),
      borrowApyPercentage: new BigNumber(apiMarket.borrowApy),
      borrowRatePerBlock: new BigNumber(apiMarket.borrowRatePerBlock),
      supplyRatePerBlock: new BigNumber(apiMarket.supplyRatePerBlock),
      exchangeRateMantissa: new BigNumber(apiMarket.exchangeRateMantissa),
      underlyingAddress: apiMarket.underlyingAddress ?? NULL_ADDRESS,
      underlyingTokenPriceMantissa: new BigNumber(apiMarket.underlyingPriceMantissa),
      supplyCapsMantissa: new BigNumber(apiMarket.supplyCapsMantissa),
      borrowCapsMantissa: new BigNumber(apiMarket.borrowCapsMantissa),
      cashMantissa: new BigNumber(apiMarket.cashMantissa),
      reserveFactorMantissa: new BigNumber(apiMarket.reserveFactorMantissa),
      collateralFactorMantissa: new BigNumber(apiMarket.collateralFactorMantissa),
      totalReservesMantissa: new BigNumber(apiMarket.totalReservesMantissa),
      totalBorrowsMantissa: new BigNumber(apiMarket.totalBorrowsMantissa),
      totalSupplyMantissa: new BigNumber(apiMarket.totalSupplyMantissa),
      totalXvsDistributedTokens,
      estimatedPrimeBorrowApyBoost: apiMarket.estimatedPrimeBorrowApyBoost
        ? new BigNumber(apiMarket.estimatedPrimeBorrowApyBoost)
        : undefined,
      estimatedPrimeSupplyApyBoost: apiMarket.estimatedPrimeSupplyApyBoost
        ? new BigNumber(apiMarket.estimatedPrimeSupplyApyBoost)
        : undefined,
      pausedActionsBitmap: apiMarket.pausedActionsBitmap,
      isListed: apiMarket.isListed,
    };
  });

  return { markets };
};

export default getLegacyPoolMarkets;
