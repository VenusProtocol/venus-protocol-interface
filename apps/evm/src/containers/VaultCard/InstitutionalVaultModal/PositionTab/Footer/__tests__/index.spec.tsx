import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { usdc } from '__mocks__/models/tokens';
import { useNow } from 'hooks/useNow';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { VaultCategory, VaultStatus, VaultType, VaultVenue } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { Footer, type FooterProps } from '..';
import { getProjectedYieldTokens } from '../getProjectedYieldTokens';

vi.mock('hooks/useNow');

const lockingPeriodMs = 2592000 * 1000;

const baseVault = {
  vaultType: VaultType.Institutional,
  category: VaultCategory.STABLECOINS,
  venue: VaultVenue.Institution,
  venueName: 'Matrixdock',
  venueUrl: 'https://fake-venue-url.com',
  venueIconSrc: 'matrixdock',
  status: VaultStatus.Deposit,
  key: 'institutional-usdc',
  stakedToken: usdc,
  rewardToken: usdc,
  stakedTokenPriceCents: new BigNumber(100),
  rewardTokenPriceCents: new BigNumber(100),
  stakeAprPercentage: 8,
  stakeBalanceMantissa: new BigNumber('500000000'),
  stakeBalanceCents: 50000,
  userStakeBalanceMantissa: new BigNumber('100000000'),
  userStakeBalanceCents: 10000,
  vaultAddress: '0x5263D68786AaCfad74B9aa385A004c272548e8B7',
  reserveFactor: 0,
  vaultDeploymentDate: new Date('2026-04-01T00:00:00.000Z'),
  openStartDate: new Date('2026-04-07T00:00:00.000Z'),
  openEndDate: new Date('2026-04-08T00:00:00.000Z'),
  lockEndDate: new Date('2026-08-29T00:00:00.000Z'),
  maturityDate: new Date('2026-09-01T00:00:00.000Z'),
  settlementDate: new Date('2026-09-01T00:00:00.000Z'),
  stakeLimitMantissa: new BigNumber('1000000000'),
  stakeMinMantissa: new BigNumber('10000000'),
  userMinIndividualStakeMantissa: new BigNumber('10000000'),
  userRedeemLimitMantissa: new BigNumber(0),
  userWithdrawLimitMantissa: new BigNumber(0),
  collateralToken: usdc,
  lockingPeriodMs,
} satisfies InstitutionalVault;

const baseProps: FooterProps = {
  vault: baseVault,
};

const getRow = (getByText: (text: string) => HTMLElement, label: string) =>
  getByText(label).parentElement?.parentElement;

const openTooltip = async (row: HTMLElement) => {
  const tooltipTrigger = row.querySelector('svg');

  expect(tooltipTrigger).toBeInTheDocument();

  fireEvent.click(tooltipTrigger as SVGElement);

  await waitFor(() =>
    expect(
      screen.getByText(en.vault.modals.institutionalTimeline.depositPeriod),
    ).toBeInTheDocument(),
  );
};

describe('InstitutionalVaultModal Footer', () => {
  const mockUseNow = useNow as Mock;

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
  });

  it('renders only the APR and deposit period rows when the wallet is disconnected', () => {
    const { getByText, queryByText } = renderComponent(<Footer {...baseProps} />);

    expect(getByText(en.vault.modals.targetApr)).toBeInTheDocument();
    expect(
      getByText(formatPercentageToReadableValue(baseVault.stakeAprPercentage)),
    ).toBeInTheDocument();
    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: baseVault.openEndDate })),
    ).toBeInTheDocument();

    expect(queryByText(en.vault.modals.currentDeposited)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.totalTargetRewards)).not.toBeInTheDocument();
  });

  it('renders the current deposited and total yields rows for connected accounts', () => {
    const { getByText } = renderComponent(<Footer {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    const currentDepositedRow = getRow(getByText, en.vault.modals.currentDeposited);
    const totalTargetRewardsRow = getRow(getByText, en.vault.modals.totalTargetRewards);

    expect(currentDepositedRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: convertMantissaToTokens({
          value: baseVault.userStakeBalanceMantissa,
          token: baseVault.stakedToken,
        }),
        token: baseVault.stakedToken,
      }),
    );
    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: getProjectedYieldTokens({
          depositTokens: new BigNumber(100),
          stakeAprPercentage: baseVault.stakeAprPercentage,
          lockingPeriodMs,
        }),
        token: baseVault.stakedToken,
      }),
    );
  });

  it('updates total yields based on the current and hypothetical deposited amounts', () => {
    const fromAmountTokens = new BigNumber(50);
    const currentDepositTokens = new BigNumber(100);
    const updatedDepositTokens = currentDepositTokens.plus(fromAmountTokens);

    const { getByText } = renderComponent(
      <Footer {...baseProps} fromAmountTokens={fromAmountTokens} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentDepositedRow = getRow(getByText, en.vault.modals.currentDeposited);
    const totalTargetRewardsRow = getRow(getByText, en.vault.modals.totalTargetRewards);

    expect(currentDepositedRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: currentDepositTokens,
        token: baseVault.stakedToken,
      }),
    );
    expect(currentDepositedRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: updatedDepositTokens,
        token: baseVault.stakedToken,
      }),
    );
    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: getProjectedYieldTokens({
          depositTokens: currentDepositTokens,
          stakeAprPercentage: baseVault.stakeAprPercentage,
          lockingPeriodMs,
        }),
        token: baseVault.stakedToken,
      }),
    );
    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: getProjectedYieldTokens({
          depositTokens: updatedDepositTokens,
          stakeAprPercentage: baseVault.stakeAprPercentage,
          lockingPeriodMs,
        }),
        token: baseVault.stakedToken,
      }),
    );
  });

  it('prefers userYieldTokens over the projected yield when available', () => {
    const { getByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          status: VaultStatus.Liquidated,
          userYieldTokens: new BigNumber(-40),
        }}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const totalTargetRewardsRow = getRow(getByText, en.vault.modals.totalTargetRewards);

    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: new BigNumber(-40),
        token: baseVault.stakedToken,
      }),
    );
  });

  it('omits hypothetical updates when the entered amount is zero', () => {
    const currentDepositTokens = new BigNumber(100);
    const updatedDepositTokens = currentDepositTokens.plus(50);

    const { getByText, queryByText } = renderComponent(
      <Footer {...baseProps} fromAmountTokens={new BigNumber(0)} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentDepositedRow = getRow(getByText, en.vault.modals.currentDeposited);
    const totalTargetRewardsRow = getRow(getByText, en.vault.modals.totalTargetRewards);

    expect(currentDepositedRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: currentDepositTokens,
        token: baseVault.stakedToken,
      }),
    );
    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: getProjectedYieldTokens({
          depositTokens: currentDepositTokens,
          stakeAprPercentage: baseVault.stakeAprPercentage,
          lockingPeriodMs,
        }),
        token: baseVault.stakedToken,
      }),
    );
    expect(
      queryByText(
        formatTokensToReadableValue({
          value: updatedDepositTokens,
          token: baseVault.stakedToken,
        }),
      ),
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        formatTokensToReadableValue({
          value: getProjectedYieldTokens({
            depositTokens: updatedDepositTokens,
            stakeAprPercentage: baseVault.stakeAprPercentage,
            lockingPeriodMs,
          }),
          token: baseVault.stakedToken,
        }),
      ),
    ).not.toBeInTheDocument();
  });

  it('does not render total yields when the locking period is unavailable', () => {
    const { queryByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          lockingPeriodMs: undefined,
        }}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByText(en.vault.modals.totalTargetRewards)).not.toBeInTheDocument();
  });

  it('falls back to zero projected yield for refund vaults when userYieldTokens is unavailable', () => {
    const { getByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          status: VaultStatus.Refund,
        }}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const totalTargetRewardsRow = getRow(getByText, en.vault.modals.totalTargetRewards);

    expect(totalTargetRewardsRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: new BigNumber(0),
        token: baseVault.stakedToken,
      }),
    );
  });

  it('renders the deposit period end row for pending vaults before deposits close', () => {
    const openEndDate = new Date('2026-04-10T00:00:00.000Z');

    const { getByText, queryByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          status: VaultStatus.Pending,
          openEndDate,
        }}
      />,
    );

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: openEndDate })),
    ).toBeInTheDocument();
    expect(queryByText(en.vault.modals.maturityDate)).not.toBeInTheDocument();
  });

  it('renders a TBD deposit period end when the open end date is unavailable', () => {
    const { getByText, queryByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          status: VaultStatus.Active,
          openEndDate: undefined,
        }}
      />,
    );

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(getByText(t('vault.timeline.tbd'))).toBeInTheDocument();
    expect(queryByText(en.vault.modals.maturityDate)).not.toBeInTheDocument();
  });

  it('renders the maturity date row after the deposit period ends', () => {
    const { getByText, queryByText } = renderComponent(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          status: VaultStatus.Active,
        }}
      />,
    );

    expect(getByText(en.vault.modals.maturityDate)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: baseVault.maturityDate })),
    ).toBeInTheDocument();
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
  });

  it('renders the institutional timeline in the checkpoint tooltip', async () => {
    const { getByText } = renderComponent(<Footer {...baseProps} />);

    const checkpointRow = getRow(getByText, en.vault.modals.depositPeriodEnds);

    expect(checkpointRow).toBeInTheDocument();

    await openTooltip(checkpointRow as HTMLElement);

    expect(
      screen.getByText(en.vault.modals.institutionalTimeline.depositPeriod),
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('vault.timeline.textualWithTime', { date: baseVault.openEndDate })),
    ).toBeInTheDocument();
    expect(
      screen.getByText(en.vault.modals.institutionalTimeline.estimatedRepayingPeriod),
    ).toBeInTheDocument();
  });
});
