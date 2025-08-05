import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import { encodeFunctionData } from 'viem';
import type { Mock } from 'vitest';
import { useClaimRewards } from '..';

vi.mock('libs/contracts');

vi.mock('viem', () => ({
  ...vi.importActual('viem'),
  encodeFunctionData: vi.fn(() => '0x01'),
}));

const fakeClaims = [
  {
    contract: 'vaiVault',
  },
  {
    contract: 'xvsVestingVault',
    rewardToken: xvs,
    poolIndex: 0,
  },
  {
    contract: 'legacyPoolComptroller',
    vTokenAddressesWithPendingReward: [
      '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
      '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
      '0x74469281310195a04840daf6edf576f559a3de80',
    ],
  },
  {
    contract: 'rewardsDistributor',
    contractAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    comptrollerContractAddress: '0x19Hfee254729296a45a3885639AC7E10F9d54979',
    vTokenAddressesWithPendingReward: [
      '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
      '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
    ],
  },
  {
    contract: 'prime',
    vTokenAddressesWithPendingReward: [
      '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
      '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
    ],
  },
];

const fakeInput = {
  claims: fakeClaims,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useClaimRewards', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useClaimRewards(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeMulticall3ContractAddress",
        "args": [
          true,
          [
            {
              "callData": "0x01",
              "target": "0xfakeVaiVaultContractAddress",
            },
            {
              "callData": "0x01",
              "target": "0xfakeXvsVaultContractAddress",
            },
            {
              "callData": "0x01",
              "target": "0xfakeLegacyPoolComptrollerContractAddress",
            },
            {
              "callData": "0x01",
              "target": "0xc0ffee254729296a45a3885639AC7E10F9d54979",
            },
            {
              "callData": "0x01",
              "target": "0xfakePrimeContractAddress",
            },
            {
              "callData": "0x01",
              "target": "0xfakePrimeContractAddress",
            },
          ],
        ],
        "functionName": "tryBlockAndAggregate",
      }
    `,
    );

    expect(encodeFunctionData).toHaveBeenCalledTimes(6);

    (encodeFunctionData as Mock).mock.calls.forEach(call => {
      expect(call[0]).toMatchSnapshot({
        abi: expect.any(Array),
      });
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(5);
    expect(mockCaptureAnalyticEvent.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "VAI vault reward claimed",
          {},
        ],
        [
          "XVS vesting vault reward claimed",
          {
            "poolIndex": 0,
            "rewardTokenSymbol": "XVS",
          },
        ],
        [
          "Pool reward claimed",
          {
            "comptrollerAddress": "0xfakeLegacyPoolComptrollerContractAddress",
          },
        ],
        [
          "Pool reward claimed",
          {
            "comptrollerAddress": "0x19Hfee254729296a45a3885639AC7E10F9d54979",
          },
        ],
        [
          "Prime reward claimed",
          {},
        ],
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1);
    expect((queryClient.invalidateQueries as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "queryKey": [
            "GET_PENDING_REWARDS",
            {
              "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
              "chainId": 97,
            },
          ],
        },
      ]
    `);
  });

  it('throws when contract addresses could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useClaimRewards(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
