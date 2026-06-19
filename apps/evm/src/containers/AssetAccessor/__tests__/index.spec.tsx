import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { TokenAnnouncement } from 'containers/TokenAnnouncement';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Asset, Pool } from 'types';

import AssetAccessor, { type AssetAccessorProps } from '..';

vi.mock('containers/TokenAnnouncement');

const mockUseGetPool = useGetPool as Mock;
const mockTokenAnnouncement = TokenAnnouncement as Mock;

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];

const borrowProps: Omit<AssetAccessorProps, 'children'> = {
  poolComptrollerAddress: fakePool.comptrollerAddress,
  vToken: fakeAsset.vToken,
  action: 'borrow',
};

const supplyProps: Omit<AssetAccessorProps, 'children'> = {
  ...borrowProps,
  action: 'supply',
};

const withdrawProps: Omit<AssetAccessorProps, 'children'> = {
  ...borrowProps,
  action: 'withdraw',
};

const repayProps: Omit<AssetAccessorProps, 'children'> = {
  ...borrowProps,
  action: 'repay',
};

const fakeChildrenContent = 'Fake content';

const TestComponent = () => <>{fakeChildrenContent}</>;

const getCustomFakePool = ({
  pool = fakePool,
  asset = {},
}: {
  pool?: Pool;
  asset?: Partial<Asset>;
} = {}): Pool => ({
  ...pool,
  assets: pool.assets.map(currentAsset =>
    currentAsset.vToken.address === fakeAsset.vToken.address
      ? {
          ...currentAsset,
          ...asset,
        }
      : currentAsset,
  ),
});

const mockGetPool = (pool: Pool = fakePool) => {
  mockUseGetPool.mockImplementation(() => ({
    isLoading: false,
    data: {
      pool,
    },
  }));
};

describe('containers/AssetAccessor', () => {
  beforeEach(() => {
    mockGetPool();
    mockTokenAnnouncement.mockImplementation(() => null);
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());
  });

  it('renders token announcement if a disabled borrow action has an announcement for the token', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          disabledTokenActions: ['borrow'],
        },
      }),
    );

    const fakeTokenAnnouncementText = 'Fake token announcement';
    mockTokenAnnouncement.mockImplementation(() => fakeTokenAnnouncementText);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeTokenAnnouncementText)).toBeInTheDocument());

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders a restricted asset notice when the asset is unavailable in the user country', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          isRestricted: true,
          userBorrowBalanceCents: new BigNumber(1),
        },
      }),
    );

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(en.assetAccessor.assetNotAvailable)).toBeInTheDocument());

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders children for a restricted asset when the user withdraws an existing supply position', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(1),
        },
      }),
    );

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...withdrawProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());

    expect(queryByText(en.assetAccessor.assetNotAvailable)).toBeNull();
  });

  it('renders children for a restricted asset when the user repays an existing borrow position', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          isRestricted: true,
          userBorrowBalanceCents: new BigNumber(1),
        },
      }),
    );

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...repayProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());

    expect(queryByText(en.assetAccessor.assetNotAvailable)).toBeNull();
  });

  it('renders default token announcement if a disabled borrow action has no token announcement', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          disabledTokenActions: ['borrow'],
        },
      }),
    );

    mockTokenAnnouncement.mockImplementation(() => null);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument(),
    );

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders token announcement if a disabled non-borrow action has an announcement for the token', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          disabledTokenActions: ['supply'],
        },
      }),
    );

    const fakeTokenAnnouncementText = 'Fake token announcement';
    mockTokenAnnouncement.mockImplementation(() => fakeTokenAnnouncementText);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...supplyProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() => expect(getByText(fakeTokenAnnouncementText)).toBeInTheDocument());

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default announcement about borrow being disabled if the asset is not borrowable from the pool', async () => {
    mockGetPool(
      getCustomFakePool({
        asset: {
          isBorrowable: false,
          isBorrowableByUser: false,
        },
      }),
    );

    mockTokenAnnouncement.mockImplementation(() => null);

    const { getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument(),
    );

    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default announcement about borrow being disabled due to E-mode settings if the asset is not borrowable by the user', async () => {
    mockGetPool(
      getCustomFakePool({
        pool: {
          ...fakePool,
          userEModeGroup: fakePool.eModeGroups[0],
        },
        asset: {
          isBorrowableByUser: false,
        },
      }),
    );

    const { container, getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(container).toHaveTextContent(
        'Your E-mode settings do not allow you to borrow from this market.',
      ),
    );

    expect(getByText(en.eModeBanner.manageEModeButtonLabel)).toBeInTheDocument();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('renders default announcement about borrow being disabled due to isolation mode settings if the asset is not borrowable by the user', async () => {
    mockGetPool(
      getCustomFakePool({
        pool: {
          ...fakePool,
          userEModeGroup: fakePool.eModeGroups[2],
        },
        asset: {
          isBorrowableByUser: false,
        },
      }),
    );

    const { container, getByText, queryByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
    );

    await waitFor(() =>
      expect(container).toHaveTextContent(
        'Your isolation mode settings do not allow you to borrow from this market.',
      ),
    );

    expect(getByText(en.eModeBanner.manageEModeButtonLabel)).toBeInTheDocument();
    expect(queryByText(fakeChildrenContent)).toBeNull();
  });

  it('fetches the correct pool and asset and passes them to the children render function', async () => {
    let fetchedPool: Pool | undefined;
    let fetchedAsset: Asset | undefined;

    renderComponent(
      <AssetAccessor {...borrowProps}>
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
    expect(mockUseGetPool).toHaveBeenCalledWith({
      poolComptrollerAddress: fakePool.comptrollerAddress,
      accountAddress: fakeAddress,
    });
  });

  it('renders children if user has connected their wallet and enabled token', async () => {
    const { getByText } = renderComponent(
      <AssetAccessor {...borrowProps}>{() => <TestComponent />}</AssetAccessor>,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => expect(getByText(fakeChildrenContent)).toBeInTheDocument());
  });
});
