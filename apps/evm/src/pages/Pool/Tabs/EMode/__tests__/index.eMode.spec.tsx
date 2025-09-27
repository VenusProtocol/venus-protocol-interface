import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { EMode } from '..';

const fakePool = poolData[0];

describe('EMode', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
    );
  });

  it('renders correctly', async () => {
    const { container } = renderComponent(
      <EMode pool={fakePool} searchValue="" onSearchValueChange={noop} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when user is connected', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userEModeGroup: fakePool.eModeGroups[0],
    };

    const { container } = renderComponent(
      <EMode pool={customFakePool} searchValue="" onSearchValueChange={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('filters E-mode groups based on search correctly', async () => {
    const { container } = renderComponent(
      <EMode pool={fakePool} searchValue="moon" onSearchValueChange={noop} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
