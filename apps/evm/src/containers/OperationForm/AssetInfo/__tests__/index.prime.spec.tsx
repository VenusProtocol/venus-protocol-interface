import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { exactAmountInSwap } from '__mocks__/models/swaps';
import { useGetHypotheticalUserPrimeApys } from 'hooks/useGetHypotheticalUserPrimeApys';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import { AssetInfo, type AssetInfoProps } from '..';

vi.mock('hooks/useGetHypotheticalUserPrimeApys');

describe('AssetInfo - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );

    (useGetHypotheticalUserPrimeApys as Vi.Mock).mockImplementation(() => ({
      supplyApyPercentage: new BigNumber(13.4),
      borrowApyPercentage: new BigNumber(10.4),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<AssetInfo asset={poolData[0].assets[1]} action="supply" />);
  });

  it.each([
    { action: 'supply' },
    { action: 'withdraw' },
    { action: 'borrow' },
    { action: 'repay' },
  ] as { action: AssetInfoProps['action']; amountToken: number }[])(
    'renders correct values: %s',
    async ({ action }) => {
      const { container } = renderComponent(
        <AssetInfo asset={poolData[0].assets[1]} action={action} />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );

  it.each([
    { action: 'supply' },
    { action: 'withdraw' },
    { action: 'borrow' },
    { action: 'repay' },
  ] as { action: AssetInfoProps['action']; amountToken: number }[])(
    'renders correct values when using swap: %s',
    async ({ action }) => {
      const { container } = renderComponent(
        <AssetInfo
          asset={poolData[0].assets[1]}
          action={action}
          amountTokens={new BigNumber(1)} // The actual amount used is defined by the swap
          swap={exactAmountInSwap}
          isUsingSwap
        />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
