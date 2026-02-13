import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { fireEvent } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { eModeGroups } from '__mocks__/models/eModeGroup';
import { poolData } from '__mocks__/models/pools';
import { vai } from '__mocks__/models/tokens';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { areTokensEqual } from 'utilities';
import { EMode } from '..';
import { formatEModeGroups } from '../../formatEModeGroups';

const fakePool = poolData[0];

const renderEMode = (pool: Pool) => {
  const extendedEModeGroups = formatEModeGroups({ pool, formatTo: vi.fn(), vai });

  return renderComponent(
    <EMode
      pool={pool}
      notice={<span>Fake notice</span>}
      extendedEModeGroups={extendedEModeGroups}
    />,
    {
      accountAddress: fakeAccountAddress,
    },
  );
};

describe('EMode', () => {
  it('renders correctly', async () => {
    const { container } = renderEMode(fakePool);

    expect(container.textContent).toMatchSnapshot();
  });

  it('filters E-mode groups based on search correctly', async () => {
    const { getByPlaceholderText, container } = renderEMode(fakePool);

    fireEvent.change(getByPlaceholderText(en.markets.tabs.eMode.search.placeholder), {
      target: {
        value: 'defi',
      },
    });

    expect(container.textContent).toMatchSnapshot();
  });

  it('only displays groups related to user when filter is on', async () => {
    (useUserChainSettings as Mock).mockReturnValue([
      {
        showUserAssetsOnly: true,
      },
      vi.fn(),
    ]);

    const fakeFilteredOutEModeGroup = eModeGroups[1];

    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(asset => {
        // Check if asset is part of filtered out E-mode group
        if (
          fakeFilteredOutEModeGroup.assetSettings.some(setting =>
            areTokensEqual(setting.vToken, asset.vToken),
          )
        ) {
          return {
            ...asset,
            userBorrowBalanceCents: new BigNumber(0),
            userSupplyBalanceCents: new BigNumber(0),
            userWalletBalanceCents: new BigNumber(0),
          };
        }

        return asset;
      }),
    };

    const { container } = renderEMode(customFakePool);

    expect(container.textContent).toMatchSnapshot();
  });
});
