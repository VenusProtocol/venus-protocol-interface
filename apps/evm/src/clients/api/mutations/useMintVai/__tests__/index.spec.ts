import mockVaiControllerContractAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useMintVai } from '..';

const fakeInput = {
  amountMantissa: new BigNumber('10000000000000000'),
};

vi.mock('libs/contracts');

describe('useMintVai', () => {
  beforeEach(() => {
    vi.mocked(useGetVaiControllerContractAddress).mockReturnValue(mockVaiControllerContractAddress);
  });

  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useMintVai());

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as jest.Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
        "args": [
          10000000000000000n,
        ],
        "functionName": "mintVAI",
      }
    `,
    );

    const { onConfirmed } = (useSendTransaction as jest.Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when VAI contract address is not found', async () => {
    (useGetVaiControllerContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useMintVai());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
