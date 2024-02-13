import { fireEvent } from '@testing-library/react';
import { en } from 'libs/translations';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import AssetWarning from '.';
import TEST_IDS from './AssetTable/testIds';

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
    const { getByText, getByTestId } = renderComponent(
      <AssetWarning
        token={fakePool.assets[0].vToken.underlyingToken}
        pool={fakePool}
        type="borrow"
      />,
    );

    const showAssetsButton = getByText(
      en.assetWarning.showMarketsButtonLabel.replace('{{poolName}}', fakePool.name),
    );
    fireEvent.click(showAssetsButton);

    const assetTable = getByTestId(TEST_IDS.assetTable);
    expect(assetTable.textContent).toMatchSnapshot();
  });
});
