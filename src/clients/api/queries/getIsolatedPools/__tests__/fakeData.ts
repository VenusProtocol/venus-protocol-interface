import { BigNumber } from 'bignumber.js';

import { GetTokenBalancesOutput } from 'clients/api/queries/getTokenBalances';
import { IsolatedPoolsQuery, RiskRating } from 'clients/subgraph/gql/queries';
import { TESTNET_TOKENS } from 'constants/tokens';

export const fakeGetTokenBalancesOutput: GetTokenBalancesOutput = {
  tokenBalances: [
    {
      token: TESTNET_TOKENS.wbtc,
      balanceWei: new BigNumber('10000000000'),
    },
    {
      token: TESTNET_TOKENS.venusCake,
      balanceWei: new BigNumber('20000000000'),
    },
    {
      token: TESTNET_TOKENS.wbnb,
      balanceWei: new BigNumber('30000000000'),
    },
    {
      token: TESTNET_TOKENS.bnx,
      balanceWei: new BigNumber('40000000000'),
    },
  ],
};

export const fakeGetSubgraphIsolatedPoolsOutput: IsolatedPoolsQuery = {
  pools: [
    {
      id: '0x2f83bc52a10546ec3a2cabbb706c82b869d2d677',
      priceOracleAddress: '0x4736cd7783736425b3855581c3d40fb153daf322',
      name: 'Pool 2',
      description: '',
      riskRating: RiskRating.VeryHighRisk,
      markets: [
        {
          id: '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
          borrowCapMantissa: '10000000000000000000000',
          supplyCapMantissa: '10000000000000000000000',
          reservesMantissa: '0',
          treasuryTotalSupplyMantissa: '1000000000',
          treasuryTotalBorrowsMantissa: '0',
          reserveFactorMantissa: '0',
          collateralFactorMantissa: '700000000000000000',
          borrowRateMantissa: '0',
          supplyRateMantissa: '0',
          exchangeRateMantissa: '10000000000000000000000000000',
          cash: '10',
          supplierCount: '0',
          borrowerCount: '0',
          liquidationThresholdMantissa: '700000000000000000',
          accounts: [],
        },
        {
          id: '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
          borrowCapMantissa: '10000000000000000000000',
          supplyCapMantissa: '10000000000000000000000',
          reservesMantissa: '0',
          treasuryTotalSupplyMantissa: '1000000000',
          treasuryTotalBorrowsMantissa: '0',
          reserveFactorMantissa: '0',
          collateralFactorMantissa: '700000000000000000',
          borrowRateMantissa: '0',
          supplyRateMantissa: '0',
          exchangeRateMantissa: '10000000000000000000000000000',
          cash: '10',
          supplierCount: '0',
          borrowerCount: '0',
          liquidationThresholdMantissa: '700000000000000000',
          accounts: [],
        },
      ],
      rewardsDistributors: [
        {
          reward: '0xca83b44f7eea4ca927b6ce41a48f119458acde4c',
          rewardSpeeds: [],
        },
        {
          reward: '0xadbed07126b7b70cbc5e07bf73599d55be571b9c',
          rewardSpeeds: [],
        },
      ],
    },
    {
      id: '0x6ced7215ebf7b421ebda06feb64f1fd24118b0c9',
      priceOracleAddress: '0x4736cd7783736425b3855581c3d40fb153daf322',
      name: 'Pool 1',
      description: '',
      riskRating: RiskRating.VeryHighRisk,
      markets: [
        {
          id: '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
          borrowCapMantissa: '10000000000000000000000',
          supplyCapMantissa: '10000000000000000000000',
          reservesMantissa: '0',
          treasuryTotalSupplyMantissa: '1000000000',
          treasuryTotalBorrowsMantissa: '0',
          reserveFactorMantissa: '0',
          collateralFactorMantissa: '700000000000000000',
          borrowRateMantissa: '0',
          supplyRateMantissa: '0',
          exchangeRateMantissa: '10000000000000000000000000000',
          cash: '10',
          supplierCount: '0',
          borrowerCount: '0',
          liquidationThresholdMantissa: '700000000000000000',
          accounts: [],
        },
        {
          id: '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
          borrowCapMantissa: '10000000000000000000000',
          supplyCapMantissa: '10000000000000000000000',
          reservesMantissa: '0',
          treasuryTotalSupplyMantissa: '1000000000',
          treasuryTotalBorrowsMantissa: '0',
          reserveFactorMantissa: '0',
          collateralFactorMantissa: '700000000000000000',
          borrowRateMantissa: '0',
          supplyRateMantissa: '0',
          exchangeRateMantissa: '10000000000000000000000000000',
          cash: '10',
          supplierCount: '0',
          borrowerCount: '0',
          liquidationThresholdMantissa: '700000000000000000',
          accounts: [],
        },
      ],
      rewardsDistributors: [
        {
          reward: '0xa14c236372228b6e8182748f3ebbfb4bfeea3574',
          rewardSpeeds: [],
        },
        {
          reward: '0xadbed07126b7b70cbc5e07bf73599d55be571b9c',
          rewardSpeeds: [],
        },
      ],
    },
  ],
};
