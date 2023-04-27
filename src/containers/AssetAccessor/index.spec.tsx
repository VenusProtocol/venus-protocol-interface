import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';
import { Asset, Pool } from 'types';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import useTokenApproval from 'hooks/useTokenApproval';
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
    const { getByText, queryByText } = renderComponent(() => (
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>
    ));

    await waitFor(() => expect(getByText(fakeProps.connectWalletMessage)).toBeInTheDocument());
    expect(queryByText(fakeProps.enableTokenMessage)).toBeNull();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('asks user with their wallet connected to enable token if they have not done so already', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as jest.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: noop,
    }));

    const { getByText, queryByText } = renderComponent(
      () => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => expect(getByText(fakeProps.enableTokenMessage)).toBeInTheDocument());
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('fetches the correct pool and asset and passes them to the children render function', async () => {
    let fetchedPool: Pool | undefined;
    let fetchedAsset: Asset | undefined;

    renderComponent(
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

    await waitFor(() => expect(fetchedPool).toBe(fakePool));
    expect(fetchedAsset).toBe(fakeAsset);
  });

  it('renders children if user has connected their wallet and enabled token', async () => {
    const { getByText } = renderComponent(
      () => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());
  });
});
