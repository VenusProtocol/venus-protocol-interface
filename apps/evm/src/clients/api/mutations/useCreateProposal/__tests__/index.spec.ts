import fakeGovernorBravoDelegateContractAddress from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useCreateProposal } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  targets: ['0x456', '0x789'] as const,
  values: ['1000000000000000000', '2000000000000000000'],
  signatures: ['transfer(address,uint256)', 'approve(address,uint256)'],
  callDatas: ['0x123', '0x456'] as const,
  description: 'Test proposal',
  proposalType: 0 as const,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useCreateProposal', () => {
  beforeEach(() => {
    (useGetGovernorBravoDelegateContractAddress as Mock).mockReturnValue(
      fakeGovernorBravoDelegateContractAddress,
    );
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useCreateProposal(fakeOptions));

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
          [
            "0x456",
            "0x789",
          ],
          [
            1000000000000000000n,
            2000000000000000000n,
          ],
          [
            "transfer(address,uint256)",
            "approve(address,uint256)",
          ],
          [
            "0x123",
            "0x456",
          ],
          "Test proposal",
          0,
        ],
        "functionName": "propose",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetGovernorBravoDelegateContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useCreateProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
