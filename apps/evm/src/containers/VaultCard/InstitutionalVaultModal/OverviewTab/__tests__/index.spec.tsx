import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { institutionalVault } from '__mocks__/models/vaults';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import { OverviewTab } from '..';

vi.mock('hooks/useNow');

describe('containers/VaultCard/InstitutionalVaultModal/OverviewTab', () => {
  beforeEach(() => {
    (useNow as Mock).mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('renders total deposits, campaign timeline, strategy, and market info', () => {
    renderComponent(<OverviewTab vault={institutionalVault} />);

    expect(screen.getAllByText(en.vault.modals.overview.totalDeposited).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        `${formatCentsToReadableValue({
          value: institutionalVault.stakeBalanceCents,
        })} / ${formatCentsToReadableValue({ value: 100000000 })}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `500K / ${formatTokensToReadableValue({
          value: institutionalVault.stakeLimitMantissa.dividedBy(1_000_000),
          token: institutionalVault.stakedToken,
        })}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.campaignTimeline)).toBeInTheDocument();
    expect(
      screen.getByText(en.vault.modals.institutionalTimeline.depositPeriod),
    ).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.strategyAllocation)).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.strategy.venusVault)).toBeInTheDocument();
    expect(screen.getAllByText(en.vault.modals.overview.strategy.venue).length).toBeGreaterThan(0);
    expect(screen.getByText(en.vault.modals.overview.marketInfo)).toBeInTheDocument();
    expect(screen.getByText(institutionalVault.collateralToken?.symbol || '')).toBeInTheDocument();
  });
});
