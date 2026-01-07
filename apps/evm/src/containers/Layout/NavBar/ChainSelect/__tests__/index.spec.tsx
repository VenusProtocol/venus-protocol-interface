import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import { renderComponent } from 'testUtils/render';

import { useSwitchChain } from 'libs/wallet';
import { ChainId } from 'types';

import { ChainSelect } from '..';

describe('ChainSelect', () => {
  it('renders without crashing', () => {
    renderComponent(<ChainSelect />);
  });

  it('calls the right method on chain change', () => {
    const switchChainMock = vi.fn();

    (useSwitchChain as Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const { container } = renderComponent(<ChainSelect />);

    // Change select value
    fireEvent.change(container.querySelector('input') as HTMLInputElement, {
      target: { value: ChainId.SEPOLIA },
    });

    expect(switchChainMock).toHaveBeenCalledTimes(1);
    expect(switchChainMock).toHaveBeenCalledWith({
      chainId: ChainId.SEPOLIA,
    });
  });
});
