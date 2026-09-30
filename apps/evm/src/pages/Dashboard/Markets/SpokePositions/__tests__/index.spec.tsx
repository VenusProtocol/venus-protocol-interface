import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

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

  it('still lists a debt on a market that is not on the loan side', () => {
    const misclassifiedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.vToken.underlyingToken.symbol === 'USDT' ? { ...asset, isBorrowable: false } : asset,
      ),
    };

    renderComponent(<SpokePositions spokePool={misclassifiedPool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getAllByText('USDT').length).toBeGreaterThan(0);
  });

  it('shows the health factor and account health with a borrow', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getAllByText(en.account.spoke.summary.healthFactor).length).toBeGreaterThan(0);
    expect(screen.getAllByText(en.accountHealth.liquidationThreshold).length).toBeGreaterThan(0);
  });

  it('hides the health factor and account health without a borrow', () => {
    const supplyOnlyPool = {
      ...spokePool,
      userBorrowBalanceCents: new BigNumber(0),
      assets: spokePool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceCents: new BigNumber(0),
        userBorrowBalanceTokens: new BigNumber(0),
      })),
    };

    renderComponent(<SpokePositions spokePool={supplyOnlyPool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.queryByText(en.account.spoke.summary.healthFactor)).not.toBeInTheDocument();
    expect(screen.queryByText(en.accountHealth.liquidationThreshold)).not.toBeInTheDocument();
    expect(screen.queryByText(en.accountHealth.liquidationThresholdShort)).not.toBeInTheDocument();
  });
});
