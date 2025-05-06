import fakeAccountAddress, {
  altAddress as mockPrimeContractAddress,
} from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetPrimeContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useClaimPrimeToken } from '..';

vi.mock('libs/contracts');

describe('useClaimPrimeToken', () => {
  beforeEach(() => {
    (useGetPrimeContractAddress as Mock).mockReturnValue(mockPrimeContractAddress);
  });

  it('should throw error if Prime contract address is not available', async () => {
    (useGetPrimeContractAddress as Mock).mockReturnValue(null);

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

    const { fn } = (useSendTransaction as jest.Mock).mock.calls[0][0];

    expect(await fn()).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [],
        "functionName": "claim",
      }
    `,
    );

    const { onConfirmed } = (useSendTransaction as jest.Mock).mock.calls[0][0];
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
