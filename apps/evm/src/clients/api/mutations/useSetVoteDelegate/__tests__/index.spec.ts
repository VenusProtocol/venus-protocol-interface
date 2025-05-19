import fakeAccountAddress, {
  altAddress as fakeXvsVaultContractAddress,
} from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSetVoteDelegate } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  delegateAddress: '0x123' as const,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useSetVoteDelegate', () => {
  beforeEach(() => {
    (useGetXvsVaultContractAddress as Mock).mockReturnValue(fakeXvsVaultContractAddress);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useSetVoteDelegate(fakeOptions), {
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
          "0x123",
        ],
        "functionName": "delegate",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetXvsVaultContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useSetVoteDelegate(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
