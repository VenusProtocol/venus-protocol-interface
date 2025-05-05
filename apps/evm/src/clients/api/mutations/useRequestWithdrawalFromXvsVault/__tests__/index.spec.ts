import fakeAccountAddress, {
  altAddress as xvsVaultContractAddress,
} from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useRequestWithdrawalFromXvsVault } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');
vi.mock('libs/tokens');
vi.mock('libs/wallet');

const fakeInput = {
  rewardTokenAddress: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47' as Address,
  poolIndex: 4n,
  amountMantissa: 1000000000000n,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useRequestWithdrawalFromXvsVault', () => {
  beforeEach(() => {
    (useGetXvsVaultContractAddress as Mock).mockImplementation(() => xvsVaultContractAddress);
    (useGetToken as Mock).mockImplementation(() => xvs);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useRequestWithdrawalFromXvsVault(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(`
      {
        "abi": [],
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          4n,
          1000000000000n,
        ],
        "functionName": "requestWithdrawal",
      }
    `);

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Token withdrawal requested from XVS vault",
        {
          "poolIndex": 4,
          "rewardTokenSymbol": "XVS",
          "tokenAmountTokens": 0.000001,
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_XVS_VAULT_USER_INFO",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "poolIndex": 4,
                "rewardTokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_XVS_VAULT_WITHDRAWAL_REQUESTS",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "poolIndex": 4,
                "rewardTokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
              },
            ],
          },
        ],
      ]
    `);
  });

  it('throws error when XVS Vault contract address is not found', async () => {
    (useGetXvsVaultContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useRequestWithdrawalFromXvsVault(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
