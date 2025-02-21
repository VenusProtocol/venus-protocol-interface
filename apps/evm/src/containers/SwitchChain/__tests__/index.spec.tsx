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

  it('renders without SwitchChain', () => {
    renderComponent(<SwitchChain />);
  });

  it('displays children when user is not connected', async () => {
    renderComponent(<SwitchChain>{fakeContent}</SwitchChain>);

    expect(screen.queryByText(fakeContent)).toBeInTheDocument();
  });

  it('displays switch button when user is connected to the wrong chain', async () => {
    renderComponent(<SwitchChain chainId={ChainId.BSC_TESTNET}>{fakeContent}</SwitchChain>, {
      accountAddress: fakeAddress,
      chainId: ChainId.ETHEREUM,
    });

    expect(screen.queryByText(fakeContent)).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        en.switchChain.switchButton.replace(
          '{{chainName}}',
          chainMetadata[ChainId.BSC_TESTNET].name,
        ),
      ),
    ).toBeInTheDocument();
  });

  it('calls switchChain when switch button is clicked', async () => {
    const mockSwitchChain = vi.fn();
    (useSwitchChain as Mock).mockReturnValue({ switchChain: mockSwitchChain });

    renderComponent(<SwitchChain chainId={ChainId.BSC_TESTNET}>{fakeContent}</SwitchChain>, {
      accountAddress: fakeAddress,
      chainId: ChainId.ETHEREUM,
    });

    fireEvent.click(
      screen.getByText(
        en.switchChain.switchButton.replace(
          '{{chainName}}',
          chainMetadata[ChainId.BSC_TESTNET].name,
        ),
      ),
    );

    await waitFor(() => expect(mockSwitchChain).toHaveBeenCalledTimes(1));
    expect(mockSwitchChain).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });
});
