import noop from 'noop-ts';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import useGetNativeWrappedTokenUserBalances from 'hooks/useGetNativeWrappedTokenUserBalances';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

import Supply from '..';
import {
  fakeAsset,
  fakeEthTokenBalance,
  fakePool,
  fakeWEthTokenBalance,
  fakeWethAsset,
} from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('libs/tokens');
vi.mock('hooks/useGetNativeWrappedTokenUserBalances');

describe('RepayForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );

    (useGetNativeWrappedTokenUserBalances as Vi.Mock).mockImplementation(() => ({
      data: [fakeEthTokenBalance, fakeWEthTokenBalance],
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Supply asset={fakeAsset} pool={fakePool} onCloseModal={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays the token selector if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible();
  });
});
