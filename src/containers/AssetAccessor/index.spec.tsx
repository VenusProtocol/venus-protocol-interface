import { waitFor } from '@testing-library/react';
import { TokenAnnouncement } from 'components';
import noop from 'noop-ts';
import React from 'react';
import { Asset, Pool } from 'types';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import { isTokenActionEnabled } from 'utilities/isTokenActionEnabled';

import AssetAccessor, { AssetAccessorProps } from '.';

vi.mock('clients/api');
vi.mock('components/TokenAnnouncement');
vi.mock('utilities/isTokenActionEnabled');

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];

const fakeProps: Omit<AssetAccessorProps, 'children'> = {
  poolComptrollerAddress: fakePool.comptrollerAddress,
  vToken: fakeAsset.vToken,
  connectWalletMessage: 'Fake connect wallet message',
  approveTokenMessage: 'Fake enable token message',
  action: 'borrow',
};

const fakeChildrenContent = 'Fake content';

const TestComponent = () => <>{fakeChildrenContent}</>;

describe('containers/AssetAccessor', () => {
  it('renders without crashing', async () => {
    renderComponent(() => <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>);
  });

  it('renders token announcement if action has been disabled and an announcement exists for that token', async () => {
    (isTokenActionEnabled as Vi.Mock).mockImplementation(() => false);

    const fakeTokenAnnouncementText = 'Fake token announcement';
    (TokenAnnouncement as Vi.Mock).mockImplementation(() => fakeTokenAnnouncementText);

    const { getByText, queryByText } = renderComponent(() => (
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>
    ));

    await waitFor(() => expect(getByText(fakeTokenAnnouncementText)).toBeInTheDocument());

    expect(queryByText(fakeProps.connectWalletMessage)).toBeNull();
    expect(queryByText(fakeProps.approveTokenMessage)).toBeNull();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default token announcement if action has been disabled and no announcement exists for that token', async () => {
    (isTokenActionEnabled as Vi.Mock).mockImplementation(() => false);
    (TokenAnnouncement as Vi.Mock).mockImplementation(() => null);

    const { getByText, queryByText } = renderComponent(() => (
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>
    ));

    await waitFor(() =>
      expect(
        getByText(en.operationModal.disabledActionNotice[fakeProps.action]),
      ).toBeInTheDocument(),
    );

    expect(queryByText(fakeProps.connectWalletMessage)).toBeNull();
    expect(queryByText(fakeProps.approveTokenMessage)).toBeNull();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('asks user to connect their wallet if they have not done so already', async () => {
    const { getByText, queryByText } = renderComponent(() => (
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>
    ));

    await waitFor(() => expect(getByText(fakeProps.connectWalletMessage)).toBeInTheDocument());
    expect(queryByText(fakeProps.approveTokenMessage)).toBeNull();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('asks user with their wallet connected to enable token if they have not done so already', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
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

    await waitFor(() => expect(getByText(fakeProps.approveTokenMessage)).toBeInTheDocument());
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
