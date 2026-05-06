import type { Mock } from 'vitest';

import { institutionalVault } from '__mocks__/models/vaults';
import { useNow } from 'hooks/useNow';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';

import { InstitutionalCheckpointInlineContent } from '..';

vi.mock('hooks/useNow');

describe('InstitutionalCheckpointInlineContent', () => {
  const mockUseNow = useNow as Mock;

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('shows the deposit period end for deposit vaults', () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Deposit,
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<InstitutionalCheckpointInlineContent vault={vault} />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: vault.openEndDate })),
    ).toBeInTheDocument();
  });

  it('shows the deposit period end for pending vaults before the open end date', () => {
    const { getByText } = renderComponent(
      <InstitutionalCheckpointInlineContent vault={institutionalVault} />,
    );

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: institutionalVault.openEndDate })),
    ).toBeInTheDocument();
  });

  it('shows the deposit period end and tbd when the open end date is unavailable', () => {
    const vault = {
      ...institutionalVault,
      openEndDate: undefined,
      settlementDate: undefined,
      maturityDate: undefined,
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<InstitutionalCheckpointInlineContent vault={vault} />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(getByText(en.vault.timeline.tbd)).toBeInTheDocument();
  });

  it('shows the claim period start for pending vaults after the open end date', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const { getByText } = renderComponent(
      <InstitutionalCheckpointInlineContent vault={institutionalVault} />,
    );

    expect(getByText(en.vault.modals.claimPeriodStarts)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: institutionalVault.settlementDate })),
    ).toBeInTheDocument();
  });

  it('shows the refund period for refund vaults', () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Refund,
    } satisfies InstitutionalVault;

    const { getByText, queryByText } = renderComponent(
      <InstitutionalCheckpointInlineContent vault={vault} />,
    );

    expect(getByText(en.vault.modals.institutionalTimeline.refundPeriod)).toBeInTheDocument();
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.claimPeriodStarts)).not.toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: vault.openEndDate })),
    ).toBeInTheDocument();
  });

  it('falls back to the maturity date when the settlement date is unavailable', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const vault = {
      ...institutionalVault,
      settlementDate: undefined,
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<InstitutionalCheckpointInlineContent vault={vault} />);

    expect(getByText(en.vault.modals.claimPeriodStarts)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: vault.maturityDate })),
    ).toBeInTheDocument();
  });
});
