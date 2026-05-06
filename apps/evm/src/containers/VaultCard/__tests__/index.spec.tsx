import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { institutionalVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { useNow } from 'hooks/useNow';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault, VenusVault } from 'types';
import { VaultStatus } from 'types';
import { convertMantissaToTokens, formatTokensToReadableValue } from 'utilities';
import { VaultCard } from '..';

vi.mock('hooks/useNow');

const baseVault = institutionalVault;

const getProgressFill = (container: HTMLElement) => {
  const progressFill = container.querySelector('.w-25 > div');

  expect(progressFill).toBeInTheDocument();

  return progressFill as HTMLDivElement;
};

describe('VaultCard', () => {
  const mockUseNow = useNow as Mock;

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('renders the institutional checkpoint row for deposit periods', () => {
    const { getByText, queryByText } = renderComponent(<VaultCard vault={baseVault} />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: baseVault.openEndDate })),
    ).toBeInTheDocument();
    expect(queryByText(en.vault.modals.claimPeriodStarts)).not.toBeInTheDocument();
  });

  it('renders the institutional checkpoint row for pending vaults after the deposit period ends', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const { getByText, queryByText } = renderComponent(<VaultCard vault={baseVault} />);
    const claimPeriodRow = getByText(en.vault.modals.claimPeriodStarts).closest(
      '.flex.w-full.justify-between',
    );

    expect(getByText(en.vault.modals.claimPeriodStarts)).toBeInTheDocument();
    expect(claimPeriodRow).toHaveTextContent(
      t('vault.timeline.textualWithTime', { date: baseVault.settlementDate }),
    );
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
  });

  it('falls back to the maturity date in the institutional checkpoint row when no settlement date is available', () => {
    mockUseNow.mockReturnValue(new Date('2026-04-09T00:00:00.000Z'));

    const vault = {
      ...baseVault,
      settlementDate: undefined,
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<VaultCard vault={vault} />);
    const claimPeriodRow = getByText(en.vault.modals.claimPeriodStarts).closest(
      '.flex.w-full.justify-between',
    );

    expect(getByText(en.vault.modals.claimPeriodStarts)).toBeInTheDocument();
    expect(claimPeriodRow).toHaveTextContent(
      t('vault.timeline.textualWithTime', { date: vault.maturityDate }),
    );
  });

  it('renders a tbd institutional checkpoint when the deposit period end date is unavailable', () => {
    const vault = {
      ...baseVault,
      openEndDate: undefined,
      settlementDate: undefined,
      maturityDate: undefined,
    } satisfies InstitutionalVault;

    const { getByText, queryByText } = renderComponent(<VaultCard vault={vault} />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(getByText(en.vault.timeline.tbd)).toBeInTheDocument();
    expect(queryByText(en.vault.card.maturityDate)).not.toBeInTheDocument();
  });

  it('renders institutional total deposited as progress against the stake limit', () => {
    const { getByText, container } = renderComponent(<VaultCard vault={baseVault} />);

    const readableStakeBalance = formatTokensToReadableValue({
      value: convertMantissaToTokens({
        value: baseVault.stakeBalanceMantissa,
        token: baseVault.stakedToken,
      }),
      token: baseVault.stakedToken,
    });
    const readableStakeLimit = formatTokensToReadableValue({
      value: convertMantissaToTokens({
        value: baseVault.stakeLimitMantissa,
        token: baseVault.stakedToken,
      }),
      token: baseVault.stakedToken,
    });

    expect(getByText(`${readableStakeBalance} / ${readableStakeLimit}`)).toBeInTheDocument();
    expect(getByText('50%')).toBeInTheDocument();
    expect(getProgressFill(container)).toHaveClass('bg-blue');
  });

  it('renders the minimum requested row when the institutional vault has not reached it yet', () => {
    const vault = {
      ...baseVault,
      stakeBalanceMantissa: new BigNumber('5000000'),
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<VaultCard vault={vault} />);

    const readableStakeMinimum = formatTokensToReadableValue({
      value: convertMantissaToTokens({
        value: vault.stakeMinMantissa,
        token: vault.stakedToken,
      }),
      token: vault.stakedToken,
    });

    expect(getByText(en.vault.card.minRequested)).toBeInTheDocument();
    expect(getByText(readableStakeMinimum)).toBeInTheDocument();
  });

  it('does not render the minimum requested row once the institutional minimum is met', () => {
    const { queryByText } = renderComponent(<VaultCard vault={baseVault} />);

    expect(queryByText(en.vault.card.minRequested)).not.toBeInTheDocument();
  });

  it('renders a green progress bar once the institutional vault reaches 80 percent of the stake limit', () => {
    const vault = {
      ...baseVault,
      stakeBalanceMantissa: new BigNumber('850000000000'),
    } satisfies InstitutionalVault;

    const { container, getByText } = renderComponent(<VaultCard vault={vault} />);

    expect(getByText('85%')).toBeInTheDocument();
    expect(getProgressFill(container)).toHaveClass('bg-green');
  });

  it('renders a yellow progress bar override for refunding institutional vaults', () => {
    const vault = {
      ...baseVault,
      status: VaultStatus.Refund,
    } satisfies InstitutionalVault;

    const { container } = renderComponent(<VaultCard vault={vault} />);

    expect(getProgressFill(container)).toHaveClass('bg-yellow');
  });

  it('renders the paused warning for institutional paused vaults', () => {
    const vault = {
      ...baseVault,
      status: VaultStatus.Paused,
    } satisfies InstitutionalVault;

    const { getByText } = renderComponent(<VaultCard vault={vault} />);

    expect(getByText(en.vault.card.pausedWarning)).toBeInTheDocument();
  });

  it('renders the paused warning for paused Venus vaults', () => {
    const vault = {
      ...venusVaults[0],
      status: VaultStatus.Paused,
      isPaused: true,
    } satisfies VenusVault;

    const { getByText } = renderComponent(<VaultCard vault={vault} />);

    expect(getByText(en.vault.card.pausedWarning)).toBeInTheDocument();
  });

  it('renders the pending withdrawals warning for paused Venus vaults that are not globally paused', () => {
    const vault = {
      ...venusVaults[0],
      status: VaultStatus.Paused,
      isPaused: false,
    } satisfies VenusVault;

    const { getByText } = renderComponent(<VaultCard vault={vault} />);

    expect(getByText(en.vault.card.blockingPendingWithdrawalsWarning)).toBeInTheDocument();
  });
});
