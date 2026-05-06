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

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('returns the standard four-checkpoint timeline for non-refund vaults', () => {
    mockUseNow.mockReturnValue(new Date('2026-08-30T00:00:00.000Z'));

    const vault = {
      ...institutionalVault,
      status: VaultStatus.Repaying,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toMatchSnapshot();
  });

  it('returns the refund-specific timeline when the vault is refunding', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const vault = {
      ...institutionalVault,
      status: VaultStatus.Refund,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toEqual([
      {
        title: t('vault.modals.institutionalTimeline.depositPeriod'),
        description: `${t('vault.timeline.textualWithTime', {
          date: vault.vaultDeploymentDate,
        })} - ${t('vault.timeline.textualWithTime', { date: vault.openEndDate })}`,
        status: 'passed',
      },
      {
        title: t('vault.modals.institutionalTimeline.refundPeriod'),
        description: t('vault.timeline.textualWithTime', { date: vault.openEndDate }),
        status: 'ongoing',
      },
    ]);
  });

  it('uses the maturity date for repaying and tbd for claim when settlement date is unavailable', () => {
    const vault = {
      ...institutionalVault,
      settlementDate: undefined,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useTimeline({ vault }));

    expect(result.current.checkpoints).toMatchSnapshot();
  });
});
