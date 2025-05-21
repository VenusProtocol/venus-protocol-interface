import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
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
      }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeGovernorBravoDelegateContractAddress",
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
    `);

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useCreateProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
