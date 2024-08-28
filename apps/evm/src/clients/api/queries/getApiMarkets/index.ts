import type { ChainId, Market, Token } from 'types';
import { restService } from 'utilities';
import formatToMarket from './formatToMarket';

export interface ApiMarketData {
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
  poolComptrollerAddress: string;
  rewardsDistributors: {
    marketAddress: string;
    rewardTokenAddress: string;
    lastRewardingSupplyBlockOrTimestamp: string;
    lastRewardingBorrowBlockOrTimestamp: string;
    supplySpeed: string;
    borrowSpeed: string;
    priceMantissa: string;
    rewardsDistributorContractAddress: string | null;
  }[];
}

export interface GetApiMarketsResponse {
  result: ApiMarketData[];
  request: { addresses: string[] };
}

export interface GetApiMarketsInput {
  xvs: Token;
  chainId: ChainId;
  poolComptrollerAddress?: string;
}

export interface GetApiMarketsOutput {
  markets: Market[];
}

const getApiMarkets = async ({
  chainId,
  xvs,
  poolComptrollerAddress,
}: GetApiMarketsInput): Promise<GetApiMarketsOutput> => {
  const response = await restService<GetApiMarketsResponse>({
    endpoint: '/markets',
    method: 'GET',
    params: {
      limit: 50,
      isListed: 1,
      chainId,
      poolComptrollerAddress,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new Error(payload.error);
  }

  const markets: Market[] = (payload?.result || []).map(apiMarket =>
    formatToMarket({ apiMarket, xvs }),
  );

  return { markets };
};

export default getApiMarkets;
