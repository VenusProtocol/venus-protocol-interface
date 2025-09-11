import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import type { Order, TableColumn } from 'components';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { EModeAssetSettings, Pool } from 'types';
import { areTokensEqual } from 'utilities';
import { EModeGroup, type EModeGroupProps } from '..';

const fakeColumns: TableColumn<EModeAssetSettings>[] = [
  {
    key: 'fake-key',
    label: 'Fake label',
    selectOptionLabel: 'Fake select option label',
    renderCell: ({ vToken }) => vToken.symbol,
  },
];

const fakeOrder: Order<EModeAssetSettings> = {
  orderBy: fakeColumns[0],
  orderDirection: 'desc',
};

const fakePool = poolData[0];

const baseProps: EModeGroupProps = {
  pool: fakePool,
  eModeGroup: fakePool.eModeGroups[0],
  columns: fakeColumns,
  initialOrder: fakeOrder,
  mobileOrder: fakeOrder,
};

describe('EModeGroup', () => {
  it('lets user enable E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = baseProps.eModeGroup;

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: undefined,
      assets: fakePool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceCents: new BigNumber(0),
        userSupplyBalanceCents: new BigNumber(10000),
        isCollateralOfUser: true,
      })),
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
    );

    expect(container.textContent).toMatchSnapshot();

    expect(
      queryAllByText(en.pool.eMode.group.enableButtonLabel)[0].closest('button'),
    ).toBeEnabled();

    // TODO: check clicking on button calls correct function
  });

  it('lets user disable E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = baseProps.eModeGroup;

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
      assets: fakePool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceCents: new BigNumber(
          fakeEModeGroup.assetSettings.find(
            settings => settings.isBorrowable && areTokensEqual(settings.vToken, asset.vToken),
          )
            ? 100
            : 0,
        ),
        userSupplyBalanceCents: new BigNumber(10000),
      })),
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
    );

    expect(container.textContent).toMatchSnapshot();

    expect(
      queryAllByText(en.pool.eMode.group.disableButtonLabel)[0].closest('button'),
    ).toBeEnabled();

    // TODO: check clicking on button calls correct function
  });

  it('lets user switch E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[1];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakePool.eModeGroups[0],
      assets: fakePool.assets.map(asset => {
        const assetSettings = fakeEModeGroup.assetSettings.find(settings =>
          areTokensEqual(settings.vToken, asset.vToken),
        );

        return {
          ...asset,
          userBorrowBalanceCents: new BigNumber(assetSettings?.isBorrowable ? 100 : 0),
          userSupplyBalanceCents: new BigNumber(assetSettings ? 10000 : 0),
          isCollateralOfUser: true,
        };
      }),
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
    );

    expect(container.textContent).toMatchSnapshot();

    expect(
      queryAllByText(en.pool.eMode.group.switchButtonLabel)[0].closest('button'),
    ).toBeEnabled();

    // TODO: check clicking on button calls correct function
  });

  describe.each([
    ['enable', undefined, fakePool.eModeGroups[0], en.pool.eMode.group.enableButtonLabel],
    [
      'switch',
      fakePool.eModeGroups[0],
      fakePool.eModeGroups[1],
      en.pool.eMode.group.switchButtonLabel,
    ],
  ])('error states', (action, userEModeGroup, eModeGroup, buttonLabel) => {
    it(`does not let user ${action} E-mode group if they have blocking borrow positions`, async () => {
      const customFakePool: Pool = {
        ...baseProps.pool,
        userEModeGroup,
        assets: fakePool.assets.map(asset => ({
          ...asset,
          userBorrowBalanceCents: new BigNumber(100),
          userSupplyBalanceCents: new BigNumber(10000),
        })),
      };

      const { queryAllByText } = renderComponent(
        <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={eModeGroup} />,
      );

      expect(queryAllByText(buttonLabel)[0].closest('button')).toBeDisabled();
    });

    it(`does not let user ${action} E-mode group if their collateral value would not cover their borrow balance`, async () => {
      const customFakePool: Pool = {
        ...baseProps.pool,
        userEModeGroup,
        assets: fakePool.assets.map(asset => ({
          ...asset,
          collateralFactor: 0,
          userCollateralFactor: 0.9,
          userBorrowBalanceCents: new BigNumber(100),
          userSupplyBalanceCents: new BigNumber(10000),
        })),
      };

      const { queryAllByText } = renderComponent(
        <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={eModeGroup} />,
      );

      expect(queryAllByText(buttonLabel)[0].closest('button')).toBeDisabled();
    });
  });

  it('does not let user disable E-mode group if they have blocking borrow positions', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[0];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
      assets: fakePool.assets.map(asset => ({
        ...asset,
        isCollateralOfUser: true,
        userBorrowBalanceCents: new BigNumber(100),
        userSupplyBalanceCents: new BigNumber(10000),
      })),
    };

    const { queryAllByText } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
    );

    expect(
      queryAllByText(en.pool.eMode.group.disableButtonLabel)[0].closest('button'),
    ).toBeDisabled();
  });

  it('does not let user disable E-mode group if their collateral value would not cover their borrow balance', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[0];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
      assets: fakePool.assets.map(asset => ({
        ...asset,
        collateralFactor: 0,
        userCollateralFactor: 0.9,
        userBorrowBalanceCents: new BigNumber(asset.isBorrowable ? 100 : 0),
        userSupplyBalanceCents: new BigNumber(10000),
      })),
    };

    const { queryAllByText } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
    );

    expect(
      queryAllByText(en.pool.eMode.group.disableButtonLabel)[0].closest('button'),
    ).toBeDisabled();
  });
});
