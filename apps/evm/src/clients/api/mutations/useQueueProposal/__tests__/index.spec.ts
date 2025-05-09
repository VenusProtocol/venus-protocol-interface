import fakeGovernorBravoDelegateContractAddress from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useQueueProposal } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  proposalId: 123,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useQueueProposal', () => {
  beforeEach(() => {
    (useGetGovernorBravoDelegateContractAddress as Mock).mockReturnValue(
      fakeGovernorBravoDelegateContractAddress,
    );
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useQueueProposal(fakeOptions));

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
        "address": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
        "args": [
          123n,
        ],
        "functionName": "queue",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_PROPOSALS",
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_PROPOSAL",
              {
                "id": 123,
              },
            ],
          },
        ],
      ]
    `);
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetGovernorBravoDelegateContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useQueueProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
