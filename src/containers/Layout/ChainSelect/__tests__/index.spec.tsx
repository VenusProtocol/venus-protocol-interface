import { fireEvent } from '@testing-library/react';
import { ChainId } from 'types';
import Vi from 'vitest';

import { useAuth } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';

import { ChainSelect } from '..';

vi.mock('context/AuthContext');

const switchChainMock = vi.fn();

describe('ChainSelect', () => {
  beforeEach(() => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
      switchChain: switchChainMock,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<ChainSelect />);
  });

  it('calls the right method on chain change', () => {
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
