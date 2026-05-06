import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import { institutionalVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { type InstitutionalVault, VaultStatus } from 'types';

import { useGetVaults } from 'clients/api';

import Staking from '..';

describe('Vaults', () => {
  const fakeVaults = [institutionalVault, ...venusVaults];
  const titleSelector = 'p.truncate.text-b1s';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-05T00:00:00.000Z'));

    (useGetVaults as Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders vaults correctly', () => {
    const { getByText } = renderComponent(<Staking />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: institutionalVault.openEndDate })),
    ).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
  });

  it('filters vaults from the url venue parameter', () => {
    const { getByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?venue=matrixdock'],
    });

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults from the url category parameter', () => {
    const { getByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?category=governance'],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('MATRIXDOCK')).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults by token symbol search', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderComponent(<Staking />);

    fireEvent.change(getByPlaceholderText(en.vault.filter.inputPlaceholder), {
      target: { value: 'xvs' },
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('MATRIXDOCK')).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults from the url status parameter', () => {
    const liquidatedInstitutionalVault = {
      ...institutionalVault,
      status: VaultStatus.Liquidated,
    } satisfies InstitutionalVault;

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [liquidatedInstitutionalVault, ...venusVaults],
      isLoading: false,
    }));

    const { getAllByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?status=liquidated'],
    });

    expect(getAllByText(en.vault.filter.liquidated)).toHaveLength(2);
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });
});
