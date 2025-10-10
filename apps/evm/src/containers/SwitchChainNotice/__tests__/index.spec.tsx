import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { ChainId } from '@venusprotocol/chains';
import { chains } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { en } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { SwitchChainNotice } from '..';

const fakeContent = 'Fake content';

describe('SwitchChainNotice', () => {
  beforeEach(() => {
    (useSwitchChain as Mock).mockReturnValue({ switchChain: vi.fn() });
  });

  it('renders without crashing', () => {
    renderComponent(<SwitchChainNotice />);
  });

  it('displays nothing when user is not connected', async () => {
    const { container } = renderComponent(<SwitchChainNotice>{fakeContent}</SwitchChainNotice>);

    expect(container).toBeEmptyDOMElement();
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
    it('displays nothing when user is connected to the correct chain', async () => {
      const { container } = renderComponent(
        <SwitchChainNotice chainId={targetChainId}>{fakeContent}</SwitchChainNotice>,
        {
          accountAddress: fakeAddress,
          chainId,
          accountChainId,
        },
      );

      expect(container).toBeEmptyDOMElement();
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
    it('displays warning when user is connected to the wrong chain', async () => {
      renderComponent(
        <SwitchChainNotice chainId={targetChainId}>{fakeContent}</SwitchChainNotice>,
        {
          accountAddress: fakeAddress,
          accountChainId,
          chainId,
        },
      );

      expect(screen.queryByText(fakeContent)).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          en.switchChainNotice.description.replace(
            '{{chainName}}',
            chains[targetChainId || chainId].name,
          ),
        ),
      ).toBeInTheDocument();
    });

    it('calls switchChain when switch button is clicked', async () => {
      const mockSwitchChain = vi.fn();
      (useSwitchChain as Mock).mockReturnValue({ switchChain: mockSwitchChain });

      renderComponent(
        <SwitchChainNotice chainId={targetChainId}>{fakeContent}</SwitchChainNotice>,
        {
          accountAddress: fakeAddress,
          chainId,
          accountChainId,
        },
      );

      fireEvent.click(
        screen.getByText(
          en.switchChainNotice.buttonLabel.replace(
            '{{chainName}}',
            chains[targetChainId || chainId].name,
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
