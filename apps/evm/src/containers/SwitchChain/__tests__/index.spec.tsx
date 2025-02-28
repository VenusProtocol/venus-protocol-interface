import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { ChainId } from '@venusprotocol/chains';
import { chainMetadata } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { en } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { SwitchChain } from '..';

const fakeContent = 'Fake content';

describe('SwitchChain', () => {
  beforeEach(() => {
    (useSwitchChain as Mock).mockReturnValue({ switchChain: vi.fn() });
  });

  it('renders without crashing', () => {
    renderComponent(<SwitchChain />);
  });

  it('displays children when user is not connected', async () => {
    renderComponent(<SwitchChain>{fakeContent}</SwitchChain>);

    expect(screen.queryByText(fakeContent)).toBeInTheDocument();
  });

  describe.each([
    {
      description: 'without chainId prop',
      accountChainId: ChainId.BSC_TESTNET,
      chainId: ChainId.BSC_TESTNET,
      targetChainId: undefined,
    },
    {
      description: 'with chainId prop',
      accountChainId: ChainId.BSC_TESTNET,
      chainId: ChainId.ETHEREUM,
      targetChainId: ChainId.BSC_TESTNET,
    },
  ])('$description', async ({ accountChainId, chainId, targetChainId }) => {
    it('displays children when user is connected to the correct chain', async () => {
      renderComponent(<SwitchChain chainId={targetChainId}>{fakeContent}</SwitchChain>, {
        accountAddress: fakeAddress,
        accountChainId,
        chainId,
      });

      expect(screen.queryByText(fakeContent)).toBeInTheDocument();
    });
  });

  describe.each([
    {
      description: 'without chainId prop',
      accountChainId: ChainId.ETHEREUM,
      chainId: ChainId.BSC_TESTNET,
      targetChainId: undefined,
    },
    {
      description: 'with chainId prop',
      accountChainId: ChainId.ETHEREUM,
      chainId: ChainId.ETHEREUM,
      targetChainId: ChainId.BSC_TESTNET,
    },
  ])('$description', async ({ accountChainId, chainId, targetChainId }) => {
    it('displays switch button when user is connected to the wrong chain', async () => {
      renderComponent(<SwitchChain chainId={targetChainId}>{fakeContent}</SwitchChain>, {
        accountAddress: fakeAddress,
        accountChainId,
        chainId,
      });

      expect(screen.queryByText(fakeContent)).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[targetChainId || chainId].name,
          ),
        ),
      ).toBeInTheDocument();
    });

    it('calls switchChain when switch button is clicked', async () => {
      const mockSwitchChain = vi.fn();
      (useSwitchChain as Mock).mockReturnValue({ switchChain: mockSwitchChain });

      renderComponent(<SwitchChain chainId={targetChainId}>{fakeContent}</SwitchChain>, {
        accountAddress: fakeAddress,
        chainId,
        accountChainId,
      });

      fireEvent.click(
        screen.getByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[targetChainId || chainId].name,
          ),
        ),
      );

      await waitFor(() => expect(mockSwitchChain).toHaveBeenCalledTimes(1));
      expect(mockSwitchChain).toHaveBeenCalledWith({
        chainId: targetChainId || chainId,
      });
    });
  });
});
