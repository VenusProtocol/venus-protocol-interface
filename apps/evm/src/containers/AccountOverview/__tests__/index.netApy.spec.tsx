import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPool, useGetVaults } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { AccountOverview } from '..';
import { testIds } from '../testIds';

const getNetApyCell = () => {
  const labelElement = screen.getByText(en.dashboard.overview.summary.cellGroup.netApy);
  const cell = labelElement.parentElement?.parentElement;

  expect(cell).toBeInTheDocument();

  return cell as HTMLElement;
};

const renderExpandedAccountOverview = async () => {
  const result = renderComponent(<AccountOverview accountAddress={fakeAccountAddress} />, {
    accountAddress: fakeAccountAddress,
  });

  await waitFor(() =>
    expect(result.queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument(),
  );

  // Expand accordion to reveal the summary cells
  fireEvent.click(screen.getByText(en.dashboard.overview.absolutePerformance).closest('button')!);

  return result;
};

describe('AccountOverview net APY color', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseGetVaults = useGetVaults as Mock;

  beforeEach(() => {
    mockUseGetVaults.mockReturnValue({
      isLoading: false,
      data: [],
    });
  });

  it('displays a positive net APY in blue', async () => {
    const poolWithPositiveYearlyEarnings = {
      ...poolData[0],
      userYearlyEarningsCents: new BigNumber(36500),
    } satisfies Pool;

    mockUseGetPool.mockReturnValue({
      isLoading: false,
      data: {
        pool: poolWithPositiveYearlyEarnings,
      },
    });

    await renderExpandedAccountOverview();

    expect(getNetApyCell()).toHaveClass('text-blue');
  });

  it('displays a negative net APY in white', async () => {
    const poolWithNegativeYearlyEarnings = {
      ...poolData[0],
      userYearlyEarningsCents: new BigNumber(-36500),
    } satisfies Pool;

    mockUseGetPool.mockReturnValue({
      isLoading: false,
      data: {
        pool: poolWithNegativeYearlyEarnings,
      },
    });

    await renderExpandedAccountOverview();

    expect(getNetApyCell()).toHaveClass('text-white');
  });

  it('displays a zero net APY in white', async () => {
    const poolWithZeroYearlyEarnings = {
      ...poolData[0],
      userYearlyEarningsCents: new BigNumber(0),
    } satisfies Pool;

    mockUseGetPool.mockReturnValue({
      isLoading: false,
      data: {
        pool: poolWithZeroYearlyEarnings,
      },
    });

    await renderExpandedAccountOverview();

    expect(getNetApyCell()).toHaveClass('text-white');
  });
});
