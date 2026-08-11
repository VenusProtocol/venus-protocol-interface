import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useGetChainIdsWithIsolatedPoolPosition } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import { IsolatedPoolsDeprecationNotice } from '..';

const mockOutput = ({
  chainIds = [],
  isLoading = false,
}: { chainIds?: ChainId[]; isLoading?: boolean }) =>
  (useGetChainIdsWithIsolatedPoolPosition as Mock).mockImplementation(() => ({
    chainIds,
    isLoading,
  }));

describe('IsolatedPoolsDeprecationNotice', () => {
  it('lists the chains the user has a position on', () => {
    mockOutput({ chainIds: [ChainId.BSC_MAINNET, ChainId.ETHEREUM] });

    const { container } = renderComponent(<IsolatedPoolsDeprecationNotice />);

    expect(container.textContent).toContain('BNB Chain, Ethereum');
    expect(container.textContent).toContain('Learn more');
  });

  it('renders nothing when the user has no isolated position', () => {
    mockOutput({ chainIds: [] });

    const { container } = renderComponent(<IsolatedPoolsDeprecationNotice />);

    expect(container.textContent).toBe('');
  });

  it('renders nothing while positions are still loading', () => {
    mockOutput({ chainIds: [ChainId.BSC_MAINNET], isLoading: true });

    const { container } = renderComponent(<IsolatedPoolsDeprecationNotice />);

    expect(container.textContent).toBe('');
  });

  it('lets the user dismiss it for the session', () => {
    mockOutput({ chainIds: [ChainId.BSC_MAINNET] });

    const { container, getByRole } = renderComponent(<IsolatedPoolsDeprecationNotice />);

    fireEvent.click(getByRole('button'));

    expect(container.textContent).toBe('');
  });
});
