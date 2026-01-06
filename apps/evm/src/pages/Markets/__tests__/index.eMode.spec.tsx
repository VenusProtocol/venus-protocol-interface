import BigNumber from 'bignumber.js';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { fireEvent, waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { eModeGroups } from '__mocks__/models/eModeGroup';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { routes } from 'constants/routing';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import type { Pool } from 'types';
import { Markets } from '..';

const customFakePool: Pool = {
  ...poolData[0],
  eModeGroups,
  userEModeGroup: eModeGroups[0],
  vai: {
    ...poolData[0].vai!,
    userBorrowBalanceTokens: new BigNumber(0),
    userBorrowBalanceCents: new BigNumber(0),
  },
};

describe('Markets - Feature flag enabled: E-mode', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
    );

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));
  });

  describe('Assets tab', () => {
    it('renders correctly when pool has E-mode groups', async () => {
      const { container } = renderComponent(<Markets />);

      await waitFor(() => expect(container.textContent).not.toEqual(''));

      expect(container.textContent).toMatchSnapshot();
    });
  });

  describe('E-mode tab', () => {
    it('renders correctly', async () => {
      const { container } = renderComponent(<Markets />, {
        accountAddress: fakeAccountAddress,
        routerInitialEntries: [
          `${routes.markets.path.replace(
            ':poolComptrollerAddress',
            customFakePool.comptrollerAddress,
          )}?tab=e-mode`,
        ],
        routePath: routes.markets.path,
      });

      await waitFor(() => expect(container.textContent).not.toEqual(''));

      expect(container.textContent).toMatchSnapshot();
    });

    it('filters assets correctly when using search', async () => {
      const { container, queryAllByPlaceholderText } = renderComponent(<Markets />, {
        accountAddress: fakeAccountAddress,
        routerInitialEntries: [
          `${routes.markets.path.replace(
            ':poolComptrollerAddress',
            customFakePool.comptrollerAddress,
          )}?tab=e-mode`,
        ],
        routePath: routes.markets.path,
      });

      await waitFor(() => expect(container.textContent).not.toEqual(''));

      const tokenTextFieldInput = queryAllByPlaceholderText(
        en.markets.eMode.search.placeholder,
      )[0] as HTMLInputElement;
      fireEvent.change(tokenTextFieldInput, { target: { value: 'b' } });

      expect(container.textContent).toMatchSnapshot();
    });
  });
});
