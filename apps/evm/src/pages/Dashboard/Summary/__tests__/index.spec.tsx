import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { Summary } from '..';

vi.mock('components/InfoIcon', () => ({
  InfoIcon: ({ tooltip }: { tooltip: React.ReactNode }) => (
    <span data-testid="info-icon">{tooltip}</span>
  ),
}));

const getCell = (label: string) => {
  const labelElement = screen.getByText(label);
  const cell = labelElement.parentElement?.parentElement;

  expect(cell).toBeInTheDocument();

  return cell as HTMLElement;
};

describe('pages/Dashboard/Summary', () => {
  it('renders net APY, daily earnings, total supply, and total borrow', () => {
    renderComponent(<Summary pools={[poolData[0]]} />);

    expect(screen.getByText(en.account.summary.title)).toBeInTheDocument();
    expect(screen.getByText(en.account.summary.cellGroup.netApy)).toBeInTheDocument();
    expect(screen.getByText(en.account.summary.cellGroup.dailyEarnings)).toBeInTheDocument();
    expect(screen.getByText(en.account.summary.cellGroup.totalSupply)).toBeInTheDocument();
    expect(screen.getByText(en.account.summary.cellGroup.totalBorrow)).toBeInTheDocument();
    expect(
      screen.getByText(formatCentsToReadableValue({ value: poolData[0].userSupplyBalanceCents })),
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatCentsToReadableValue({ value: poolData[0].userBorrowBalanceCents })),
    ).toBeInTheDocument();
  });

  it('renders optional total vault supply and minted VAI cells when balances exist', () => {
    renderComponent(
      <Summary
        pools={[poolData[0]]}
        vaults={[vaults[1]]}
        xvsPriceCents={new BigNumber(100)}
        vaiPriceCents={new BigNumber(100)}
      />,
    );

    expect(screen.getByText(en.account.summary.cellGroup.totalVaultStake)).toBeInTheDocument();
    expect(screen.getByText(en.account.summary.cellGroup.mintedVai)).toBeInTheDocument();
    expect(
      screen.getByText(
        formatCentsToReadableValue({ value: poolData[0].vai?.userBorrowBalanceCents }),
      ),
    ).toBeInTheDocument();
  });

  it('does not render optional cells when balances are missing', () => {
    const poolWithoutVai = {
      ...poolData[0],
      vai: undefined,
    } satisfies Pool;

    renderComponent(<Summary pools={[poolWithoutVai]} />);

    expect(
      screen.queryByText(en.account.summary.cellGroup.totalVaultStake),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(en.account.summary.cellGroup.mintedVai)).not.toBeInTheDocument();
  });

  it('does not render minted VAI when the VAI borrow balance is zero', () => {
    const poolWithZeroVaiBorrowBalance = {
      ...poolData[0],
      vai: {
        ...(poolData[0].vai as NonNullable<Pool['vai']>),
        userBorrowBalanceCents: new BigNumber(0),
      },
    } satisfies Pool;

    renderComponent(<Summary pools={[poolWithZeroVaiBorrowBalance]} />);

    expect(screen.queryByText(en.account.summary.cellGroup.mintedVai)).not.toBeInTheDocument();
  });

  it('renders positive net APY in green and negative net APY in red', () => {
    const negativePool = {
      ...poolData[0],
      userYearlyEarningsCents: new BigNumber(-36500),
    } satisfies Pool;

    const { rerender } = renderComponent(<Summary pools={[poolData[0]]} />);

    expect(getCell(en.account.summary.cellGroup.netApy)).toHaveClass('text-green');
    expect(
      screen.getByText(
        formatPercentageToReadableValue(
          new BigNumber(36500)
            .dividedBy(poolData[0].userSupplyBalanceCents || 1)
            .times(100)
            .toNumber(),
        ),
      ),
    ).toBeInTheDocument();

    rerender(<Summary pools={[negativePool]} />);

    expect(getCell(en.account.summary.cellGroup.netApy)).toHaveClass('text-red');
  });

  it('changes the net APY tooltip when vaults are included', () => {
    const { rerender } = renderComponent(<Summary pools={[poolData[0]]} />);

    expect(screen.getByText(en.account.summary.cellGroup.netApyTooltip)).toBeInTheDocument();

    rerender(<Summary pools={[poolData[0]]} vaults={[]} />);

    expect(
      screen.getByText(en.account.summary.cellGroup.netApyWithVaultStakeTooltip),
    ).toBeInTheDocument();
    expect(screen.queryByText(en.account.summary.cellGroup.netApyTooltip)).not.toBeInTheDocument();
  });
});
