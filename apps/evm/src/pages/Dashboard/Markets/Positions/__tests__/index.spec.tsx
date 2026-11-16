import { fireEvent, screen, waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { Positions } from '..';

describe('Positions', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Positions pools={[poolData[0]]} />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));
    expect(container.textContent).toMatchSnapshot();
  });

  it('opens the Core supply form instead of linking to the market page', async () => {
    const pool = poolData[0];
    const suppliedAsset = pool.assets.find(
      asset => asset.userSupplyBalanceTokens.isGreaterThan(0) || asset.isCollateralOfUser,
    );

    if (!suppliedAsset) {
      throw new Error('Missing supplied asset in fake pool');
    }

    const { container } = renderComponent(<Positions pools={[pool]} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toEqual(''));
    expect(container.querySelector('a[href*="/markets/"]')).toBeNull();

    const symbol = suppliedAsset.vToken.underlyingToken.symbol;
    fireEvent.click(screen.getAllByText(symbol)[0]);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByRole('dialog').textContent).toContain(`${symbol} / Venus Core`);
  });
});
