import { poolData as fakePools } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { Markets } from '..';

describe('Markets', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Markets pool={fakePools[0]} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when user has no position in pool', async () => {
    const poolWithNoPositions = {
      ...fakePools[0],
      assets: fakePools[0].assets.map(asset => ({
        ...asset,
        userSupplyBalanceTokens: asset.userSupplyBalanceTokens.multipliedBy(0),
        userBorrowBalanceTokens: asset.userBorrowBalanceTokens.multipliedBy(0),
        isCollateralOfUser: false,
      })),
    };

    const { container } = renderComponent(<Markets pool={poolWithNoPositions} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
