import { fireEvent, waitFor } from '@testing-library/react';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import AssetWarning from '..';
import TEST_IDS from '../testIds';

const fakePool = poolData[0];

describe('components/AssetWarning', () => {
  it('renders without crashing', () => {
    renderComponent(
      <AssetWarning
        token={fakePool.assets[0].vToken.underlyingToken}
        pool={fakePool}
        type="supply"
      />,
    );
  });

  it('displays list of assets correctly', async () => {
    const { getByRole, getByTestId } = renderComponent(
      <AssetWarning
        token={fakePool.assets[0].vToken.underlyingToken}
        pool={fakePool}
        type="borrow"
      />,
    );

    const showAssetsButton = getByRole('button');
    fireEvent.click(showAssetsButton);

    await waitFor(() => {
      expect(getByTestId(TEST_IDS.marketTable)).toBeInTheDocument();
    });
  });
});
