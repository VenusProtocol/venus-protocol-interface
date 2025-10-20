import { ChainId } from '@venusprotocol/chains';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { getContractAddress } from 'libs/contracts';
import { governanceChainId } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useExecuteProposal } from '..';

vi.mock('libs/contracts');

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useExecuteProposal', () => {
  describe.each([governanceChainId, ChainId.OPTIMISM_SEPOLIA])('%s', chainId => {
    const fakeInput = {
      chainId,
      proposalId: 123,
    };

    it('calls useSendTransaction with the correct parameters', async () => {
      renderHook(() => useExecuteProposal(fakeOptions));

      expect(useSendTransaction).toHaveBeenCalledWith({
        fn: expect.any(Function),
        onConfirmed: expect.any(Function),
        options: fakeOptions,
      });

      const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

      expect(await fn(fakeInput)).toMatchSnapshot({
        abi: expect.any(Array),
      });

      onConfirmed({ input: fakeInput });

      expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
    });

    it('throws when contract address could not be retrieved', async () => {
      (getContractAddress as Mock).mockReturnValue(undefined);

      renderHook(() => useExecuteProposal(fakeOptions));

      const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

      await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
    });
  });
});
