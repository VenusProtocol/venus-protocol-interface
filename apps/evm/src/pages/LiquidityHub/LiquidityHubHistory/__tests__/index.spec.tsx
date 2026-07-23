import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { LiquidityHubHistory } from '..';

const liquidityHub = liquidityHubs[0];

describe('LiquidityHubHistory', () => {
  const mockUseIsFeatureEnabled = useIsFeatureEnabled as Mock;

  beforeEach(() => {
    mockUseIsFeatureEnabled.mockReturnValue(false);
  });

  it('renders the current supply and unit price information', () => {
    renderComponent(<LiquidityHubHistory liquidityHub={liquidityHub} />);

    expect(screen.getByText(en.market.supplyInfo.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Position unit price (${liquidityHub.vhToken.symbol})`),
    ).toBeInTheDocument();
    expect(screen.getByText('1.06')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: en.market.periodOption.thirtyDays,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders both charts and keeps their selected periods in sync when charts are enabled', () => {
    mockUseIsFeatureEnabled.mockReturnValue(true);

    renderComponent(<LiquidityHubHistory liquidityHub={liquidityHub} />);

    const thirtyDayButtons = screen.getAllByRole('button', {
      name: en.market.periodOption.thirtyDays,
    });
    const sixMonthButtons = screen.getAllByRole('button', {
      name: en.market.periodOption.sixMonths,
    });

    expect(thirtyDayButtons).toHaveLength(2);
    expect(sixMonthButtons).toHaveLength(2);
    thirtyDayButtons.forEach(button => expect(button).toHaveClass('bg-blue'));

    fireEvent.click(sixMonthButtons[1]);

    thirtyDayButtons.forEach(button => expect(button).not.toHaveClass('bg-blue'));
    sixMonthButtons.forEach(button => expect(button).toHaveClass('bg-blue'));
  });
});
