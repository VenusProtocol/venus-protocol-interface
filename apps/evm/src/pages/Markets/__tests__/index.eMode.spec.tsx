import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { fireEvent, waitFor } from '@testing-library/react';
import { eModeGroups } from '__mocks__/models/eModeGroup';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import type { Pool } from 'types';
import { Markets } from '..';

describe('Markets - Feature flag enabled: eMode', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
    );
  });

  it('renders E-mode tab if E-mode groups are available', async () => {
    const customFakePool: Pool = {
      ...poolData[0],
      eModeGroups: eModeGroups.map(eModeGroup => ({
        ...eModeGroup,
        isIsolated: false,
      })),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    const { getByText, container } = renderComponent(<Markets />);

    await waitFor(() => expect(getByText(en.markets.tabs.eMode.label)).toBeInTheDocument());

    // Open E-mode tab
    fireEvent.click(getByText(en.markets.tabs.eMode.label));

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders Isolation mode tab if isolated E-mode groups are available', async () => {
    const customFakePool: Pool = {
      ...poolData[0],
      eModeGroups: eModeGroups.map(eModeGroup => ({
        ...eModeGroup,
        isIsolated: true,
      })),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    const { getByText, container } = renderComponent(<Markets />);

    await waitFor(() => expect(getByText(en.markets.tabs.isolationMode.label)).toBeInTheDocument());

    // Open isolated mode tab
    fireEvent.click(getByText(en.markets.tabs.isolationMode.label));

    expect(container.textContent).toMatchSnapshot();
  });
});
