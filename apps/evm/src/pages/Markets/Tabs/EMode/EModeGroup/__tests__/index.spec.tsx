import type { Mock } from 'vitest';

import { fireEvent, waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useSetEModeGroup } from 'clients/api';
import type { Order, TableColumn } from 'components';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Asset, EModeAssetSettings, Pool } from 'types';
import { EModeGroup, type EModeGroupProps } from '..';
import type { BlockingBorrowPosition } from '../../../types';

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
  userHasEnoughCollateral: true,
  hypotheticalUserHealthFactor: 10,
  userBlockingBorrowPositions: [],
};

const mockSetEModeGroup = vi.fn();

const generateFakeBlockingBorrowPositions = ({ assets }: { assets: Asset[] }) =>
  assets.map<BlockingBorrowPosition>(asset => ({
    token: asset.vToken.underlyingToken,
    userBorrowBalanceCents: asset.userBorrowBalanceCents.toNumber(),
    userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
    to: 'fake-to',
  }));

describe('EModeGroup', () => {
  beforeEach(() => {
    (useSetEModeGroup as Mock).mockImplementation(() => ({
      mutateAsync: mockSetEModeGroup,
      isPending: false,
    }));
  });

  it('lets user enable E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = baseProps.eModeGroup;

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} eModeGroup={fakeEModeGroup} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const button = queryAllByText(en.markets.tabs.eMode.group.enableButtonLabel)[0].closest(
      'button',
    );

    expect(button).toBeEnabled();
    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() => expect(mockSetEModeGroup).toHaveBeenCalledTimes(1));
    expect(mockSetEModeGroup).toHaveBeenCalledWith({
      comptrollerContractAddress: fakePool.comptrollerAddress,
      userEModeGroupName: fakePool.userEModeGroup?.name,
      eModeGroupId: fakeEModeGroup.id,
      eModeGroupName: fakeEModeGroup.name,
    });
  });

  it('lets user disable E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = baseProps.eModeGroup;

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const button = queryAllByText(en.markets.tabs.eMode.group.disableButtonLabel)[0].closest(
      'button',
    );

    expect(button).toBeEnabled();
    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() => expect(mockSetEModeGroup).toHaveBeenCalledTimes(1));
    expect(mockSetEModeGroup).toHaveBeenCalledWith({
      comptrollerContractAddress: customFakePool.comptrollerAddress,
      userEModeGroupName: customFakePool.userEModeGroup?.name,
      eModeGroupId: 0,
      eModeGroupName: undefined,
    });
  });

  it('lets user disable inactive E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[3];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const button = queryAllByText(en.markets.tabs.eMode.group.disableButtonLabel)[0].closest(
      'button',
    );

    expect(button).toBeEnabled();
    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() => expect(mockSetEModeGroup).toHaveBeenCalledTimes(1));
    expect(mockSetEModeGroup).toHaveBeenCalledWith({
      comptrollerContractAddress: customFakePool.comptrollerAddress,
      userEModeGroupName: customFakePool.userEModeGroup?.name,
      eModeGroupId: 0,
      eModeGroupName: undefined,
    });
  });

  it('lets user switch E-mode group when they meet the criteria', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[1];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakePool.eModeGroups[0],
    };

    const { queryAllByText, container } = renderComponent(
      <EModeGroup {...baseProps} pool={customFakePool} eModeGroup={fakeEModeGroup} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const button = queryAllByText(en.markets.tabs.eMode.group.switchButtonLabel)[0].closest(
      'button',
    );

    expect(button).toBeEnabled();
    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() => expect(mockSetEModeGroup).toHaveBeenCalledTimes(1));
    expect(mockSetEModeGroup).toHaveBeenCalledWith({
      comptrollerContractAddress: customFakePool.comptrollerAddress,
      userEModeGroupName: customFakePool.userEModeGroup?.name,
      eModeGroupId: fakeEModeGroup.id,
      eModeGroupName: fakeEModeGroup.name,
    });
  });

  describe.each([
    ['enable', undefined, fakePool.eModeGroups[0], en.markets.tabs.eMode.group.enableButtonLabel],
    [
      'switch',
      fakePool.eModeGroups[0],
      fakePool.eModeGroups[1],
      en.markets.tabs.eMode.group.switchButtonLabel,
    ],
  ])('error states', (action, userEModeGroup, eModeGroup, buttonLabel) => {
    it(`does not let user ${action} E-mode group if they have blocking borrow positions`, async () => {
      const customFakePool: Pool = {
        ...baseProps.pool,
        userEModeGroup,
      };

      const fakeUserBlockingBorrowPositions = generateFakeBlockingBorrowPositions({
        assets: customFakePool.assets.slice(0, 1),
      });

      const { queryAllByText } = renderComponent(
        <EModeGroup
          {...baseProps}
          pool={customFakePool}
          eModeGroup={eModeGroup}
          userBlockingBorrowPositions={fakeUserBlockingBorrowPositions}
        />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      const button = queryAllByText(buttonLabel)[0].closest('button');

      fireEvent.click(button as HTMLButtonElement);

      expect(mockSetEModeGroup).not.toHaveBeenCalled();
    });

    it(`does not let user ${action} E-mode group if their collateral value would not cover their borrow balance`, async () => {
      const customFakePool: Pool = {
        ...baseProps.pool,
        userEModeGroup,
      };

      const { queryAllByText } = renderComponent(
        <EModeGroup
          {...baseProps}
          pool={customFakePool}
          eModeGroup={eModeGroup}
          userHasEnoughCollateral={false}
        />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      const button = queryAllByText(buttonLabel)[0].closest('button');

      fireEvent.click(button as HTMLButtonElement);

      expect(mockSetEModeGroup).not.toHaveBeenCalled();
    });
  });

  it('does not let user disable E-mode group if they have blocking borrow positions', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[0];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
    };

    const fakeUserBlockingBorrowPositions = generateFakeBlockingBorrowPositions({
      assets: customFakePool.assets.slice(0, 1),
    });

    const { queryAllByText } = renderComponent(
      <EModeGroup
        {...baseProps}
        pool={customFakePool}
        eModeGroup={fakeEModeGroup}
        userBlockingBorrowPositions={fakeUserBlockingBorrowPositions}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const button = queryAllByText(en.markets.tabs.eMode.group.disableButtonLabel)[0].closest(
      'button',
    );

    fireEvent.click(button as HTMLButtonElement);

    expect(mockSetEModeGroup).not.toHaveBeenCalled();
  });

  it('does not let user disable E-mode group if their collateral value would not cover their borrow balance', async () => {
    const fakeEModeGroup = fakePool.eModeGroups[0];

    const customFakePool: Pool = {
      ...baseProps.pool,
      userEModeGroup: fakeEModeGroup,
    };

    const { queryAllByText } = renderComponent(
      <EModeGroup
        {...baseProps}
        pool={customFakePool}
        userHasEnoughCollateral={false}
        eModeGroup={fakeEModeGroup}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const button = queryAllByText(en.markets.tabs.eMode.group.disableButtonLabel)[0].closest(
      'button',
    );

    fireEvent.click(button as HTMLButtonElement);

    expect(mockSetEModeGroup).not.toHaveBeenCalled();
  });
});
