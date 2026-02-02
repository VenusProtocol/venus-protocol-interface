import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useMintVai } from '..';

const fakeInput = {
  amountMantissa: new BigNumber('10000000000000000'),
};

vi.mock('libs/contracts');

describe('useMintVai', () => {
  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useMintVai());

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeVaiControllerContractAddress",
        "args": [
          10000000000000000n,
        ],
        "functionName": "mintVAI",
      }
    `,
    );

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when VAI contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useMintVai());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
