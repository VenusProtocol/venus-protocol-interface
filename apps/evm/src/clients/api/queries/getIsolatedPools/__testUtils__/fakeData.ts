import { BigNumber as BN } from 'ethers';

import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';

import type { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

export const fakeIsolatedPoolParticipantsCount: Awaited<
  ReturnType<typeof getIsolatedPoolParticipantsCount>
> = {
  pools: fakePoolLensContractResponses.getAllPools.map(pool => ({
    __typename: 'Pool',
    id: pool.comptroller,
    markets: pool.vTokens.map(({ vToken }) => ({
      id: vToken,
      supplierCount: 10,
      borrowerCount: 20,
    })),
  })),
};

export const fakeGetPriceOutput = BN.from('0x30f7dc8a6370b000');

export const fakeGetAssetsInOutput = [
  '0x501a91b995Bd41177503A1A4144F3D25BFF869e1',
  '0x2517A3bEe42EA8f628926849B04870260164b555',
];

export const fakeGetRewardDistributorsOutput = [
  '0x170d3b2da05cc2124334240fB34ad1359e34C562',
  '0x3338988d0beb4419Acb8fE624218754053362D06',
];
