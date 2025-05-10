import fakeAccountAddress, {
  altAddress as fakeVaiVaultContractAddress,
} from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useStakeInVaiVault } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  amountMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useStakeInVaiVault', () => {
  beforeEach(() => {
    (useGetVaiVaultContractAddress as Mock).mockReturnValue(fakeVaiVaultContractAddress);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useStakeInVaiVault(fakeOptions), {
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
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          1000000000000000000n,
        ],
        "functionName": "deposit",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens staked in VAI vault', {
      tokenAmountTokens: 1,
    });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_BALANCE_OF",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "tokenAddress": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_TOKEN_ALLOWANCE",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "tokenAddress": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_BALANCE_OF",
              {
                "accountAddress": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
                "chainId": 97,
                "tokenAddress": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_VAI_VAULT_USER_INFO",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_TOKEN_BALANCES",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_VENUS_VAI_VAULT_DAILY_RATE",
            ],
          },
        ],
      ]
    `);
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetVaiVaultContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useStakeInVaiVault(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
