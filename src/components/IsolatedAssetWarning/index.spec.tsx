import { fireEvent } from '@testing-library/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import IsolatedAssetWarning from '.';
import TEST_IDS from './AssetTable/testIds';

const fakePool = poolData[0];

vi.mock('clients/api');

describe('components/IsolatedAssetWarning', () => {
  it('renders without crashing', () => {
    renderComponent(
      <IsolatedAssetWarning
        token={fakePool.assets[0].vToken.underlyingToken}
        pool={fakePool}
        type="supply"
      />,
    );
  });

  it('displays list of assets correctly', async () => {
    const { getByText, getByTestId } = renderComponent(
      <IsolatedAssetWarning
        token={fakePool.assets[0].vToken.underlyingToken}
        pool={fakePool}
        type="borrow"
      />,
    );

    const showAssetsButton = getByText(
      en.isolatedAssetWarning.showMarketsButtonLabel.replace('{{poolName}}', fakePool.name),
    );
    fireEvent.click(showAssetsButton);

    const assetTable = getByTestId(TEST_IDS.assetTable);
    expect(assetTable.textContent).toMatchSnapshot();
  });
});
