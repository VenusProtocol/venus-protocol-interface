import { ChainId } from '@venusprotocol/chains';
import fakeGovernorBravoDelegateContractAddress, {
  altAddress as fakeOmnichainGovernanceExecutorContractAddress,
} from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import {
  getGovernorBravoDelegateContractAddress,
  getOmnichainGovernanceExecutorContractAddress,
} from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useExecuteProposal } from '..';

vi.mock('libs/contracts');

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useExecuteProposal', () => {
  describe.each([governanceChain.id, ChainId.OPTIMISM_SEPOLIA])('%s', chainId => {
    beforeEach(() => {
      if (chainId === governanceChain.id) {
        (getGovernorBravoDelegateContractAddress as Mock).mockReturnValue(
          fakeGovernorBravoDelegateContractAddress,
        );
      } else {
        (getOmnichainGovernanceExecutorContractAddress as Mock).mockReturnValue(
          fakeOmnichainGovernanceExecutorContractAddress,
        );
      }
    });

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
      if (chainId === governanceChain.id) {
        (getGovernorBravoDelegateContractAddress as Mock).mockReturnValue(undefined);
      } else {
        (getOmnichainGovernanceExecutorContractAddress as Mock).mockReturnValue(undefined);
      }

      renderHook(() => useExecuteProposal(fakeOptions));

      const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

      await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
    });
  });
});
