import { BigNumber as BN } from 'ethers';

import apiPoolsResponse from '__mocks__/api/pools.json';
import type {
  IsolatedPoolComptroller,
  LegacyPoolComptroller,
  PoolLens,
  Prime,
  VaiController,
  VenusLens,
} from 'libs/contracts';

const userLegacyCollateralizedVTokenAddresses = [
  '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
  '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
  '0x171B468b52d7027F12cEF90cd065d6776a25E24e',
  '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
  '0x35566ED3AF9E537Be487C98b1811cDf95ad0C32b',
  '0x3619bdDc61189F33365CC572DF3a68FB3b316516',
  '0x3A00d9B02781f47d033BAd62edc55fBF8D083Fb0',
  '0x6AF3Fdb3282c5bb6926269Db10837fa8Aec67C04',
  '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
  '0x74469281310195A04840Daf6EdF576F559a3dE80',
  '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
  '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
  '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  '0xF06e662a00796c122AaAE935EC4F0Be3F74f5636',
  '0x4C94e67d239aD585275Fdd3246Ab82c8a2668564',
  '0x5e68913fbbfb91af30366ab1B21324410b49a308',
  '0x80CC30811e362aC9aB857C3d7875CbcCc0b65750',
  '0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E',
  '0xe237aA131E7B004aC88CB808Fa56AF3dc4C408f1',
  '0xe507B30C41E9e375BCe05197c1e09fc9ee40c0f6',
  '0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634',
  '0x1958035231E125830bA5d17D168cEa07Bb42184a',
];

const userIsolatedCollateralizedVTokenAddresses = [
  '0x4c94e67d239ad585275fdd3246ab82c8a2668564',
  '0x5e68913fbbfb91af30366ab1b21324410b49a308',
  '0x80cc30811e362ac9ab857c3d7875cbccc0b65750',
  '0xa109de0abaeefc521ec29d89ea42e64f37a6882e',
  '0xb677e080148368eeee70fa3865d07e92c6500174',
  '0xb7cac5ef82cb7f9197ee184779bdc52c5490c02a',
  '0x1958035231e125830ba5d17d168cea07bb42184a',
  '0xdedf3b2bcf25d0023115fd71a0f8221c91c92b1a',
  '0x231ded0dfc99634e52ee1a1329586bc970d773b3',
  '0x57a664dd7f1de19545fee9c86c949e3bf43d6d47',
  '0x644a149853e5507adf3e682218b8ac86cdd62951',
  '0x75aa42c832a8911b77219dbebabbb40040d16987',
  '0xd5b20708d8f0fca52cb609938d0594c4e32e5dad',
  '0xeffe7874c345ae877c1d893cd5160ddd359b24da',
  '0x3af2be7abef0f840b196d99d79f4b803a5db14a1',
  '0x170d3b2da05cc2124334240fb34ad1359e34c562',
  '0x3338988d0beb4419acb8fe624218754053362d06',
  '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
  '0x410286c43a525e1dcc7468a9b091c111c8324cd1',
  '0xd804f74fe21290d213c46610ab171f7c2eeebde7',
  '0xee543d5de2dbb5b07675fc72831a2f1812428393',
];

const userCollateralizedVTokenAddresses = [
  ...userLegacyCollateralizedVTokenAddresses,
  ...userIsolatedCollateralizedVTokenAddresses,
];

const vTokenBalancesAllMock = async (vTokenAddresses: string[]) =>
  vTokenAddresses.map(vTokenAddress => {
    const isUserCollateral = userCollateralizedVTokenAddresses.some(
      a => a.toLowerCase() === vTokenAddress.toLowerCase(),
    );

    return {
      vToken: vTokenAddress,
      balanceOf: BN.from(isUserCollateral ? '4000000000000000000' : 0),
      balanceOfUnderlying: BN.from('2000000000000000000'),
      borrowBalanceCurrent: BN.from(isUserCollateral ? '100000000000000000' : 0),
      tokenBalance: BN.from('40000000000000000000'),
      tokenAllowance: BN.from('50000000000000000000'),
    };
  });

export const fakeVenusLensContract = {
  callStatic: {
    vTokenBalancesAll: vTokenBalancesAllMock,
  },
} as unknown as VenusLens;

export const fakePoolLensContract = {
  callStatic: {
    vTokenBalancesAll: vTokenBalancesAllMock,
  },
} as unknown as PoolLens;

export const fakeVaiControllerContract = {
  getVAIRepayAmount: async () => BN.from('1000000000000000000'),
  callStatic: {
    accrueVAIInterest: vi.fn(),
  },
} as unknown as VaiController;

export const fakeIsolatedPoolComptrollerContract = {
  getAssetsIn: async () => userIsolatedCollateralizedVTokenAddresses,
} as unknown as IsolatedPoolComptroller;

export const fakeLegacyPoolComptrollerContract = {
  getAssetsIn: async () => userLegacyCollateralizedVTokenAddresses,
} as unknown as LegacyPoolComptroller;

export const fakePrimeContract = {
  tokens: async () => ({
    exists: true,
    isIrrevocable: false,
  }),
  MINIMUM_STAKED_XVS: async () => BN.from('1000000000000000000000'),
  getAllMarkets: async () => [
    '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
    '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
    '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    '0x74469281310195A04840Daf6EdF576F559a3dE80',
    '0x3338988d0beb4419Acb8fE624218754053362D06',
    '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
    '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
  ],
  estimateAPR: async () => ({
    borrowAPR: BN.from('20'),
    supplyAPR: BN.from('23'),
  }),
  calculateAPR: async () => ({
    borrowAPR: BN.from('32'),
    supplyAPR: BN.from('29'),
  }),
} as unknown as Prime;

export const fakeIsolatedPoolParticipantsCount = {
  pools: apiPoolsResponse.result.map(pool => ({
    __typename: 'Pool',
    id: pool.address,
    markets: pool.markets.map(market => ({
      id: market.address,
      supplierCount: 10,
      borrowerCount: 20,
    })),
  })),
};
