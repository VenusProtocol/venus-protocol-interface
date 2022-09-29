import { fireEvent } from '@testing-library/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import IsolatedAssetWarning from '.';
import TEST_IDS from './AssetTable/testIds';

jest.mock('clients/api');

describe('components/IsolatedAssetWarning', () => {
  // TODO: mock relevant requests once wired up (see VEN-546)
  const fakePool = poolData[0];

  it('renders without crashing', () => {
    renderComponent(
      <IsolatedAssetWarning assetId={fakePool.assets[0].id} poolId={fakePool.id} type="supply" />,
    );
  });

  it('displays list of assets correctly', async () => {
    const { getByText, getByTestId } = renderComponent(
      <IsolatedAssetWarning assetId={fakePool.assets[0].id} poolId={fakePool.id} type="borrow" />,
    );

    const showAssetsButton = getByText(
      en.isolatedAssetWarning.showMarketsButtonLabel.replace('{{poolName}}', fakePool.name),
    );
    fireEvent.click(showAssetsButton);

    const assetTable = getByTestId(TEST_IDS.assetTable);
    expect(assetTable.textContent).toMatchSnapshot();
  });
});
