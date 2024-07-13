export type MarketResponse = {
  address: string;
  supplyApy: string;
  supplyXvsApy: string;
  totalSupplyMantissa: string;
  totalBorrowsMantissa: string;
  liquidityCents: string;
  borrowApy: string;
  borrowXvsApy: string;
  symbol: string;
  tokenPriceCents: string;
  underlyingSymbol: string;
  underlyingDecimal: number;
  exchangeRateMantissa: string;
};

export type MarketMapped = {
  supplyApy: number;
  supplyXvsApy: number;
  totalSupplyUsd: number;
  totalBorrowsUsd: number;
  liquidity: number;
  borrowApy: number;
  symbol: string;
  underlyingSymbol: string;
  underlyingIconUrl: string;
  depositApy: number;
};

export type MarketsResponseData = {
  result: MarketResponse[];
};

export type ProposalsResponseData = {
  total: number;
};
