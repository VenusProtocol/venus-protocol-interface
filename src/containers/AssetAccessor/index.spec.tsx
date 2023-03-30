import { waitFor } from '@testing-library/react';
import React from 'react';
import { Asset, Pool } from 'types';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { getAllowance } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import renderComponent from 'testUtils/renderComponent';

import AssetAccessor, { AssetAccessorProps } from '.';

jest.mock('clients/api');

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];

const fakeProps: Omit<AssetAccessorProps, 'children'> = {
  poolComptrollerAddress: fakePool.comptrollerAddress,
  vToken: fakeAsset.vToken,
  connectWalletMessage: 'Fake connect wallet message',
  enableTokenMessage: 'Fake enable token message',
  assetInfoType: 'borrow',
};

const fakeChildrenContent = 'Fake content';
const TestComponent = () => <>{fakeChildrenContent}</>;

describe('containers/AssetAccessor', () => {
  it('renders without crashing', async () => {
    renderComponent(() => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>);
  });

  it('asks user to connect their wallet if they have not done so already', async () => {
    const { getByText } = renderComponent(() => (
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>
    ));

    await waitFor(() => expect(getByText(fakeProps.connectWalletMessage)).toBeInTheDocument());
    waitFor(() => expect(getByText(fakeProps.enableTokenMessage)).not.toBeInTheDocument());
    waitFor(() => expect(getByText(fakeChildrenContent)).not.toBeInTheDocument());
  });

  it('asks user with their wallet connected to enable token if they have not done so already', async () => {
    const { getByText } = renderComponent(
      () => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => expect(getByText(fakeProps.enableTokenMessage)).toBeInTheDocument());
    waitFor(() => expect(getByText(fakeChildrenContent)).not.toBeInTheDocument());
  });

  it('fetches the correct pool and asset and passes them to the children render function', async () => {
    let fetchedPool: Pool | undefined;
    let fetchedAsset: Asset | undefined;

    const { getByText } = renderComponent(
      () => (
        <AssetAccessor {...fakeProps}>
          {({ asset, pool }) => {
            fetchedPool = pool;
            fetchedAsset = asset;

            return <TestComponent />;
          }}
        </AssetAccessor>
      ),
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => expect(getByText(fakeProps.enableTokenMessage)).toBeInTheDocument());

    expect(fetchedPool).toBe(fakePool);
    expect(fetchedAsset).toBe(fakeAsset);
  });

  it('renders children if user has connected their wallet and enabled token', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => ({
      allowanceWei: MAX_UINT256,
    }));

    const { getByText } = renderComponent(
      () => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());
  });
});
