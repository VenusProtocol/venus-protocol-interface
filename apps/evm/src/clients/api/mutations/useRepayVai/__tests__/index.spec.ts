import fakeAccountAddress, {
  altAddress as mockVaiControllerContractAddress,
} from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useRepayVai } from '..';

vi.mock('libs/contracts');

const mockAmountMantissa = new BigNumber('10000000000000000');

describe('useRepayVai', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockReturnValue(vai);
    (useGetVaiControllerContractAddress as Mock).mockReturnValue(mockVaiControllerContractAddress);
  });

  it('should throw error if Prime contract address is not available', async () => {
    (useGetVaiControllerContractAddress as Mock).mockReturnValue(null);

    renderHook(() => useRepayVai());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn({ amountMantissa: mockAmountMantissa })).rejects.toThrow(
      'somethingWentWrong',
    );
  });

  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useRepayVai(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn({ amountMantissa: mockAmountMantissa })).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          10000000000000000n,
        ],
        "functionName": "repayVAI",
      }
    `,
    );

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_V_TOKEN_BALANCES_ALL",
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_USER_VAI_BORROW_BALANCE",
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
                "spenderAddress": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
                "tokenAddress": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
              },
            ],
          },
        ],
      ]
    `);
  });
});
