import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { spokePools } from '__mocks__/models/spokePools';
import { useGetSpokePools } from 'clients/api';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';
import { formatCentsToReadableValue } from 'utilities';

import { SpokeMarketInfo } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;

describe('SpokeMarketInfo', () => {
  beforeEach(() => {
    (useGetSpokePools as Mock).mockReturnValue({
      isLoading: false,
      data: { spokePools },
    });
  });

  it('shows the total supply of the market', () => {
    renderComponent(<SpokeMarketInfo />, {
      routePath: routes.spokeMarket.path,
      routerInitialEntries: [`/spoke/${spokePool.comptrollerAddress}/${loanAsset.vToken.address}`],
    });

    expect(
      screen.getByText(formatCentsToReadableValue({ value: loanAsset.supplyBalanceCents })),
    ).toBeInTheDocument();
  });
});
