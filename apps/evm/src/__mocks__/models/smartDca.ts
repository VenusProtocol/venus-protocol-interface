import type {
  ApiSmartDcaPair,
  ApiSmartDcaPlan,
  GetSmartDcaAccountPlanResponse,
  GetSmartDcaAccountPlansResponse,
  GetSmartDcaPairsResponse,
} from 'clients/api/queries/getSmartDca/types';

const usdt = {
  address: '0x1000000000000000000000000000000000000001',
  symbol: 'USDT',
  decimals: 18,
} as const;

const btcb = {
  address: '0x1000000000000000000000000000000000000002',
  symbol: 'BTCB',
  decimals: 18,
} as const;

export const smartDcaPairs: ApiSmartDcaPair[] = [
  {
    pairId: 1,
    isEnabled: true,
    stableToken: usdt,
    assetToken: btcb,
    stablePriceUsdMantissa: '100000000',
    assetPriceUsdMantissa: '9500000000000',
    stableApyRatio: '0.052',
    assetApyRatio: '0.031',
    minAmountPerBuyMantissa: '10000000000000000000',
    period: 'open',
    currentRound: 12,
    nextBuyTimestamp: 1795651200,
    newPlanFirstBuyTimestamp: 1795651200,
    userActivePlanCount: 1,
  },
];

export const smartDcaPairsResponse: GetSmartDcaPairsResponse = {
  chainId: 97,
  config: {
    isPaused: false,
    feeRateRatio: '0.1',
    maxSlippageRatio: '0.01',
    minBuys: 1,
    maxBuys: 12,
  },
  result: smartDcaPairs,
};

export const smartDcaPlans: ApiSmartDcaPlan[] = [
  {
    planId: '1',
    pairId: 1,
    status: 'active',
    isInCurrentRound: true,
    isBuying: false,
    totalBuys: 6,
    completedBuys: 2,
    buysLeft: 4,
    depositedMantissa: '600000000000000000000',
    depositedUsdMantissa: '60000000000',
    waitingMantissa: '400000000000000000000',
    waitingUsdMantissa: '40000000000',
    nextBuyTimestamp: 1795651200,
    nextBuyMantissa: '100000000000000000000',
    nextBuyUsdMantissa: '10000000000',
    boughtMantissa: '5000000000000000',
    boughtUsdMantissa: '2375000000',
    withdrawnMantissa: null,
    avgCostUsdMantissa: '9800000000000',
    earned: {
      assetMantissa: '0',
      assetUsdMantissa: '0',
      stableMantissa: '1200000000000000000',
      stableUsdMantissa: '120000000',
      totalUsdMantissa: '120000000',
    },
    pnlUsdMantissa: '1000000000',
    totalSpentMantissa: '200000000000000000000',
    totalBoughtAtBuyMantissa: '5000000000000000',
    lastBuyTimestamp: 1793059200,
  },
  {
    planId: '2',
    pairId: 1,
    status: 'matured',
    isInCurrentRound: false,
    isBuying: false,
    totalBuys: 3,
    completedBuys: 3,
    buysLeft: 0,
    depositedMantissa: '300000000000000000000',
    depositedUsdMantissa: '30000000000',
    waitingMantissa: '0',
    waitingUsdMantissa: '0',
    nextBuyTimestamp: null,
    nextBuyMantissa: '0',
    nextBuyUsdMantissa: '0',
    boughtMantissa: '3000000000000000',
    boughtUsdMantissa: '1425000000',
    withdrawnMantissa: '0',
    avgCostUsdMantissa: '9700000000000',
    earned: {
      assetMantissa: '0',
      assetUsdMantissa: '0',
      stableMantissa: '0',
      stableUsdMantissa: '0',
      totalUsdMantissa: '0',
    },
    pnlUsdMantissa: '-50000000',
    totalSpentMantissa: '300000000000000000000',
    totalBoughtAtBuyMantissa: '3000000000000000',
    lastBuyTimestamp: 1790467200,
  },
];

export const smartDcaPlansResponse: GetSmartDcaAccountPlansResponse = {
  chainId: 97,
  totals: {
    depositedUsdMantissa: '90000000000',
    holdingsUsdMantissa: '3800000000',
    holdingsApyRatio: '0.031',
    holdingsEarnedUsdMantissa: '0',
    waitingUsdMantissa: '40000000000',
    waitingApyRatio: '0.052',
    waitingEarnedUsdMantissa: '120000000',
    earnedUsdMantissa: '120000000',
    pnlUsdMantissa: '950000000',
    pnlRatio: '0.0105',
    nextBuyTimestamp: 1795651200,
    nextBuyTotalUsdMantissa: '10000000000',
  },
  result: smartDcaPlans,
};

export const smartDcaPlanDetailResponse: GetSmartDcaAccountPlanResponse = {
  chainId: 97,
  ...smartDcaPlans[0],
  buys: [
    {
      buyIndex: 1,
      round: 10,
      timestamp: 1790467200,
      status: 'done',
      spentMantissa: '100000000000000000000',
      feeMantissa: '100000000000000000',
      boughtMantissa: '2500000000000000',
      priceMantissa: '9800000000000',
      txHash: '0x2000000000000000000000000000000000000000000000000000000000000001',
    },
    {
      buyIndex: 2,
      round: 11,
      timestamp: 1793059200,
      status: 'done',
      spentMantissa: '100000000000000000000',
      feeMantissa: '100000000000000000',
      boughtMantissa: '2500000000000000',
      priceMantissa: '9650000000000',
      txHash: '0x2000000000000000000000000000000000000000000000000000000000000002',
    },
    {
      buyIndex: 3,
      round: 12,
      timestamp: 1795651200,
      status: 'next',
    },
    {
      buyIndex: 4,
      round: 13,
      timestamp: 1798329600,
      status: 'scheduled',
    },
  ],
};
