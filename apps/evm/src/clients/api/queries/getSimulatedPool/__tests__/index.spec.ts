import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';
import type { Mock } from 'vitest';

import fakeAccountAddress, {
  altAddress as fakePrimeContractAddress,
} from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import type { Asset, BalanceMutation } from 'types';
import { getSimulatedPool } from '..';

const fakeNonPrimeAsset = poolData[0].assets[0];
const fakePrimeAsset = poolData[0].assets[1];

const generateAssetBalanceMutations = ({ asset }: { asset: Asset }) => {
  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      action: 'supply',
      vTokenAddress: asset.vToken.address,
      amountTokens: new BigNumber(100),
    },
    {
      type: 'asset',
      action: 'withdraw',
      vTokenAddress: asset.vToken.address,
      amountTokens: new BigNumber(10),
    },
    {
      type: 'asset',
      action: 'borrow',
      vTokenAddress: asset.vToken.address,
      amountTokens: new BigNumber(10),
    },
    {
      type: 'asset',
      action: 'repay',
      vTokenAddress: asset.vToken.address,
      amountTokens: new BigNumber(8),
    },
  ];

  return balanceMutations;
};

describe('getSimulatedPool', () => {
  it('returns undefined pool when original pool is not provided', async () => {
    const result = await getSimulatedPool({
      publicClient: {} as unknown as PublicClient,
      pool: undefined,
      balanceMutations: [],
    });

    expect(result).toMatchSnapshot();
  });

  it('returns undefined pool when no balance mutations are provided', async () => {
    const result = await getSimulatedPool({
      publicClient: {} as unknown as PublicClient,
      pool: poolData[0],
      balanceMutations: [],
    });

    expect(result).toMatchSnapshot();
  });

  it('returns simulated pool with updated asset balances when mutations are provided', async () => {
    const fakeBalanceMutations = generateAssetBalanceMutations({ asset: fakeNonPrimeAsset });

    const result = await getSimulatedPool({
      publicClient: {} as unknown as PublicClient,
      pool: poolData[0],
      balanceMutations: fakeBalanceMutations,
    });

    expect(result).toMatchSnapshot();
  });

  it('recalculates Prime APYs when a Prime market is mutated and the user qualifies for Prime rewards', async () => {
    const readContractMock = vi.fn(async () => ({
      supplyAPR: 1000n,
      borrowAPR: 2000n,
    }));

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const fakeBalanceMutations = generateAssetBalanceMutations({ asset: fakePrimeAsset });

    const result = await getSimulatedPool({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      primeContractAddress: fakePrimeContractAddress,
      isUserPrime: true,
      userXvsStakedMantissa: new BigNumber(1000),
      pool: poolData[0],
      balanceMutations: fakeBalanceMutations,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect((readContractMock as Mock).mock.calls[0][0]).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7",
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          2000000n,
          190000000n,
          1000n,
        ],
        "functionName": "estimateAPR",
      }
    `,
    );

    expect(result).toMatchSnapshot();
  });

  it('updates simulated VAI borrow balances when VAI mutations are provided', async () => {
    const result = await getSimulatedPool({
      publicClient: {} as unknown as PublicClient,
      pool: poolData[0],
      balanceMutations: [
        {
          type: 'vai',
          action: 'borrow',
          amountTokens: new BigNumber(100),
        },
        {
          type: 'vai',
          action: 'repay',
          amountTokens: new BigNumber(10),
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });
});
