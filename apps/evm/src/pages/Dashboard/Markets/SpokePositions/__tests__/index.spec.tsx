import { fireEvent, screen } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokePositions } from '..';

const spokePool = spokePools[0];

describe('SpokePositions', () => {
  it('opens the collateral modal without the top tabs from a supplied row', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(screen.getAllByText('USDC')[0]);

    expect(
      screen.getByText(en.spokeForm.collateralModalTitle.replace('{{poolName}}', spokePool.name)),
    ).toBeInTheDocument();
    expect(screen.queryByText(en.spokeForm.loanTabTitle)).not.toBeInTheDocument();
    expect(screen.getAllByText(en.spokeForm.supply.tabTitle).length).toBeGreaterThan(0);
    expect(screen.getByText(en.spokeForm.withdraw.tabTitle)).toBeInTheDocument();
  });

  it('opens the borrow modal with both sides from a borrowed row', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(screen.getAllByText('USDT')[0]);

    expect(screen.getByText(en.spokeForm.loanTabTitle)).toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.collateralTabTitle)).toBeInTheDocument();
  });
});
