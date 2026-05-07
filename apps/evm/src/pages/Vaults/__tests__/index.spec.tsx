import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import { institutionalVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { type InstitutionalVault, VaultStatus } from 'types';

import { useGetVaults } from 'clients/api';

import Staking from '..';

describe('Vaults', () => {
  const fakeVaults = [institutionalVault, ...venusVaults];
  const titleSelector = 'p.truncate.text-b1s';

  beforeEach(() => {
    (useGetVaults as Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  it('renders vaults correctly', () => {
    const { container } = renderComponent(<Staking />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('filters vaults from the url manager parameter', () => {
    const { getByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?manager=ceffu'],
    });

    expect(getByText('USDC - CEFFU')).toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults from the url category parameter', () => {
    const { getByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?category=governance'],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('USDC - CEFFU')).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults by token symbol search', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderComponent(<Staking />);

    fireEvent.change(getByPlaceholderText(en.vault.filter.inputPlaceholder), {
      target: { value: 'xvs' },
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('USDC - CEFFU')).not.toBeInTheDocument();
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

    const { getAllByText, getByText, queryByText } = renderComponent(<Staking />, {
      routerInitialEntries: ['/?status=liquidated'],
    });

    expect(getByText('USDC - CEFFU')).toBeInTheDocument();
    expect(getAllByText(en.vault.filter.liquidated)).toHaveLength(2);
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });
});
