import { fireEvent, screen } from '@testing-library/react';

import { institutionalVault, pendleBnbVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { useGetVaults } from 'clients/api';

import VaultsPage from '..';

const titleSelector = 'p.truncate.text-b1s';
const getTitles = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(titleSelector)).map(element => element.textContent);

describe('Vaults pagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-05T00:00:00.000Z'));

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [...venusVaults, institutionalVault, pendleBnbVault],
      isLoading: false,
      dataUpdatedAt: Date.now(),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows two rows of vaults per page', () => {
    const { container } = renderComponent(<VaultsPage />);

    expect(getTitles(container)).toHaveLength(2);
    expect(screen.getByText('Items 1 - 2 out of 4')).toBeInTheDocument();
  });

  it('shows the next vaults on the next page', () => {
    const { container } = renderComponent(<VaultsPage />);
    const firstPageTitles = getTitles(container);

    fireEvent.click(screen.getByRole('button', { name: en.pagination.goToNextPage }));

    const secondPageTitles = getTitles(container);

    expect(secondPageTitles).toHaveLength(2);
    expect(secondPageTitles).not.toEqual(firstPageTitles);
  });
});
