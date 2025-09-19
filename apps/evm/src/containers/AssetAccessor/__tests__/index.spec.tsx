import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPool } from 'clients/api';
import { TokenAnnouncement } from 'containers/TokenAnnouncement';
import { en } from 'libs/translations';
import type { Asset, Pool } from 'types';

import AssetAccessor, { type AssetAccessorProps } from '..';

vi.mock('containers/TokenAnnouncement');

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];

const fakeProps: Omit<AssetAccessorProps, 'children'> = {
  poolComptrollerAddress: fakePool.comptrollerAddress,
  vToken: fakeAsset.vToken,
  action: 'borrow',
};

const fakeChildrenContent = 'Fake content';

const TestComponent = () => <>{fakeChildrenContent}</>;

describe('containers/AssetAccessor', () => {
  it('renders without crashing', async () => {
    renderComponent(<AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>);
  });

  it('renders token announcement if action has been disabled and an announcement exists for that token', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(asset =>
        asset.vToken.address === fakeAsset.vToken.address
          ? {
              ...asset,
              disabledTokenActions: ['borrow'],
            }
          : asset,
      ),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    const fakeTokenAnnouncementText = 'Fake token announcement';
    (TokenAnnouncement as Mock).mockImplementation(() => fakeTokenAnnouncementText);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeTokenAnnouncementText)).toBeInTheDocument());

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default token announcement if action has been disabled and no announcement exists for that token', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(asset =>
        asset.vToken.address === fakeAsset.vToken.address
          ? {
              ...asset,
              disabledTokenActions: ['borrow'],
            }
          : asset,
      ),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    (TokenAnnouncement as Mock).mockImplementation(() => null);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument(),
    );

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default announcement about borrow being disabled if asset is not borrowable', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(asset =>
        asset.vToken.address === fakeAsset.vToken.address
          ? {
              ...asset,
              isBorrowable: false,
            }
          : asset,
      ),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    (TokenAnnouncement as Mock).mockImplementation(() => null);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument(),
    );

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default announcement about borrow being disabled due to E-mode settings if asset is not borrowable by user', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(asset =>
        asset.vToken.address === fakeAsset.vToken.address
          ? {
              ...asset,
              isBorrowableByUser: false,
            }
          : asset,
      ),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    (TokenAnnouncement as Mock).mockImplementation(() => null);

    const { container, queryByText } = renderComponent(
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    expect(container.textContent).toMatchSnapshot();

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('fetches the correct pool and asset and passes them to the children render function', async () => {
    let fetchedPool: Pool | undefined;
    let fetchedAsset: Asset | undefined;

    renderComponent(
      <AssetAccessor {...fakeProps}>
        {({ asset, pool }) => {
          fetchedPool = pool;
          fetchedAsset = asset;

          return <TestComponent />;
        }}
      </AssetAccessor>,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => expect(fetchedPool).toBe(fakePool));
    expect(fetchedAsset).toBe(fakeAsset);
  });

  it('renders children if user has connected their wallet and enabled token', async () => {
    const { getByText } = renderComponent(
      <AssetAccessor {...fakeProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());
  });
});
