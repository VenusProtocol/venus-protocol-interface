import fakeAccountAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useRepayVai } from '..';

vi.mock('libs/contracts');

const mockAmountMantissa = new BigNumber('10000000000000000');

describe('useRepayVai', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockReturnValue(vai);
  });

  it('should throw error if Prime contract address is not available', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

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
        "address": "0xfakeVaiControllerContractAddress",
        "args": [
          10000000000000000n,
        ],
        "functionName": "repayVAI",
      }
    `,
    );

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });
});
