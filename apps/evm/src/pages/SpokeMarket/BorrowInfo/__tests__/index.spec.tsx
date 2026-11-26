import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { spokePools } from '__mocks__/models/spokePools';
import { fakeMerklCampaigns } from 'clients/api/queries/getPendingRewards/__testUtils__/fakeData';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { formatPercentageToReadableValue } from 'utilities';

import { BorrowInfo } from '..';

const loanAsset = spokePools[0].assets.find(({ isBorrowable }) => isBorrowable)!;
const [merklCampaign] = Object.values(fakeMerklCampaigns)[0];

describe('BorrowInfo', () => {
  it('shows the base borrow APY when the market has no campaign', () => {
    renderComponent(<BorrowInfo asset={{ ...loanAsset, borrowTokenDistributions: [] }} />);

    expect(screen.getByText(en.spokeMarket.borrowInfo.currentApy)).toBeInTheDocument();
    expect(
      screen.getByText(formatPercentageToReadableValue(loanAsset.borrowApyPercentage)),
    ).toBeInTheDocument();
  });

  it('shows the borrow APY net of an active Merkl campaign', () => {
    const rewardApyPercentage = loanAsset.borrowApyPercentage.plus(3);

    renderComponent(
      <BorrowInfo
        asset={{
          ...loanAsset,
          borrowTokenDistributions: [
            { ...merklCampaign, isActive: true, apyPercentage: rewardApyPercentage },
          ],
        }}
      />,
    );

    expect(
      screen.getByText(formatPercentageToReadableValue(new BigNumber(-3))),
    ).toBeInTheDocument();
  });
});
