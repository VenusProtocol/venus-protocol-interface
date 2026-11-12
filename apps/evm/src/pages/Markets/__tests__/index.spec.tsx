import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { en } from 'libs/translations';
import type { Pool } from 'types';
import { Markets } from '..';

const customFakePool: Pool = {
  ...poolData[0],
  eModeGroups: [],
  userEModeGroup: undefined,
};

describe('Markets', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));
  });

  it('renders correctly', async () => {
    const { container } = renderComponent(<Markets />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows an error with a retry button when the pools fail to load', () => {
    const refetch = vi.fn();
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      isLoadingError: true,
      refetch,
      data: undefined,
    }));

    renderComponent(<Markets />);

    expect(screen.getByText(en.market.errorState.failedToFetchMessage)).toBeInTheDocument();

    fireEvent.click(screen.getByText(en.market.errorState.refetchButtonLabel));

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
