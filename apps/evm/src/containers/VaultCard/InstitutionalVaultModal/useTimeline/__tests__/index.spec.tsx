import type { Mock } from 'vitest';

import { institutionalVault } from '__mocks__/models/vaults';
import { useNow } from 'hooks/useNow';
import { t } from 'libs/translations';
import { renderHook } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';

import { useTimeline } from '..';

vi.mock('hooks/useNow');

describe('useTimeline', () => {
  const mockUseNow = useNow as Mock;
  const formatTime = (date?: Date) => t('vault.timeline.textualWithTime', { date });

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('returns the standard four-checkpoint timeline for non-refund vaults', () => {
    mockUseNow.mockReturnValue(new Date('2026-08-30T00:00:00.000Z'));

    const vault = {
      ...institutionalVault,
      openStartDate: new Date('2026-04-07T00:00:00.000Z'),
      status: VaultStatus.Repaying,
      maturityDate: new Date('2026-09-03T00:00:00.000Z'),
      settlementDate: new Date('2026-09-01T00:00:00.000Z'),
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toEqual([
      {
        title: t('vault.modals.institutionalTimeline.depositPeriod'),
        timeRange: `${formatTime(vault.openStartDate)} - ${formatTime(vault.openEndDate)}`,
        status: 'passed',
        description: t('vault.timeline.description.deposit', {
          tokenSymbol: vault.stakedToken.symbol,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedLockedPeriod'),
        timeRange: `${formatTime(vault.openEndDate)} - ${formatTime(vault.lockEndDate)}`,
        status: 'passed',
        description: t('vault.timeline.description.locked'),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedRepayingPeriod'),
        timeRange: `${formatTime(vault.lockEndDate)} - ${formatTime(vault.settlementDate)}`,
        status: 'ongoing',
        description: t('vault.timeline.description.repaying'),
      },
      {
        title: t('vault.modals.institutionalTimeline.claimPeriod'),
        timeRange: formatTime(vault.settlementDate),
        status: 'upcoming',
        description: t('vault.timeline.description.claim'),
      },
    ]);
  });

  it('returns the refund-specific timeline when the vault is refunding', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const vault = {
      ...institutionalVault,
      openStartDate: new Date('2026-04-07T00:00:00.000Z'),
      status: VaultStatus.Refund,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toEqual([
      {
        title: t('vault.modals.institutionalTimeline.depositPeriod'),
        timeRange: `${formatTime(vault.openStartDate)} - ${formatTime(vault.openEndDate)}`,
        status: 'passed',
        description: t('vault.timeline.description.deposit', {
          tokenSymbol: vault.stakedToken.symbol,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.refundPeriod'),
        timeRange: formatTime(vault.openEndDate),
        status: 'ongoing',
        description: t('vault.timeline.description.refund'),
      },
    ]);
  });

  it('leaves the repaying period open-ended when settlement date is unavailable', () => {
    const vault = {
      ...institutionalVault,
      openStartDate: new Date('2026-04-07T00:00:00.000Z'),
      settlementDate: undefined,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toEqual([
      {
        title: t('vault.modals.institutionalTimeline.depositPeriod'),
        timeRange: `${formatTime(vault.openStartDate)} - ${formatTime(vault.openEndDate)}`,
        status: 'upcoming',
        description: t('vault.timeline.description.deposit', {
          tokenSymbol: vault.stakedToken.symbol,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedLockedPeriod'),
        timeRange: `${formatTime(vault.openEndDate)} - ${formatTime(vault.lockEndDate)}`,
        status: 'upcoming',
        description: t('vault.timeline.description.locked'),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedRepayingPeriod'),
        timeRange: formatTime(vault.lockEndDate),
        status: 'upcoming',
        description: t('vault.timeline.description.repaying'),
      },
      {
        title: t('vault.modals.institutionalTimeline.claimPeriod'),
        timeRange: undefined,
        status: 'upcoming',
        description: t('vault.timeline.description.claim'),
      },
    ]);
  });
});
