import fakeXvsVaultContractAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import type { PublicClient } from 'viem';
import type { Mock } from 'vitest';
import { getXvsVaultPendingWithdrawalsBalance } from '..';

const fakePid = 0;

describe('getXvsVaultPendingWithdrawalsBalance', () => {
  it('returns total amount of pending withdrawals in that XVS vault', async () => {
    const readContractMock = vi.fn(async () => 1000000n);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultPendingWithdrawalsBalance({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      rewardTokenAddress: xvs.address,
      poolIndex: fakePid,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect((readContractMock as Mock).mock.calls[0][0]).toMatchInlineSnapshot<any>(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
        "args": [
          "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
          0n,
        ],
        "functionName": "totalPendingWithdrawals",
      }
    `,
    );

    expect(response).toMatchInlineSnapshot(`
      {
        "balanceMantissa": "1000000",
      }
    `);
  });
});
