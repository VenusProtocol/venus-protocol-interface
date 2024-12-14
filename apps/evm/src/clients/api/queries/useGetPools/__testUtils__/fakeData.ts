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

export const fakeGetPriceOutput = BN.from('0x30f7dc8a6370b000');

const vTokenBalancesAllMock = async (vTokenAddresses: string[]) =>
  vTokenAddresses.map(vTokenAddress => ({
    vToken: vTokenAddress,
    balanceOf: BN.from('4000000000000000000'),
    balanceOfUnderlying: BN.from('2000000000000000000'),
    borrowBalanceCurrent: BN.from('100000000000000000'),
    tokenBalance: BN.from('40000000000000000000'),
    tokenAllowance: BN.from('50000000000000000000'),
  }));

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
  getAssetsIn: async () => [
    '0x501a91b995Bd41177503A1A4144F3D25BFF869e1',
    '0x2517A3bEe42EA8f628926849B04870260164b555',
  ],
} as unknown as IsolatedPoolComptroller;

export const fakeLegacyPoolComptrollerContract = {
  getAssetsIn: async () => [
    '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
    '0x171B468b52d7027F12cEF90cd065d6776a25E24e',
  ],
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
