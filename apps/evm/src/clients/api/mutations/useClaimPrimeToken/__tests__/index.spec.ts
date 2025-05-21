import fakeAccountAddress from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useClaimPrimeToken } from '..';

vi.mock('libs/contracts');

describe('useClaimPrimeToken', () => {
  it('should throw error if Prime contract address is not available', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useClaimPrimeToken());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn()).rejects.toThrow('somethingWentWrong');
  });

  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useClaimPrimeToken(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn()).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      }, `
      {
        "abi": Any<Object>,
        "address": "0xfakePrimeContractAddress",
        "args": [],
        "functionName": "claim",
      }
    `);

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "queryKey": [
            "GET_PRIME_TOKEN",
            {
              "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
              "chainId": 97,
            },
          ],
        },
      ]
    `);
  });
});
