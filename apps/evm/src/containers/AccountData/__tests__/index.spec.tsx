import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { exactAmountInSwap } from '__mocks__/models/swaps';
import { renderComponent } from 'testUtils/render';
import { AccountData, type AccountDataProps } from '..';

describe('AccountData', () => {
  it('renders without crashing', async () => {
    renderComponent(
      <AccountData
        asset={poolData[0].assets[0]}
        pool={poolData[0]}
        action="supply"
        amountTokens={new BigNumber(0)}
      />,
    );
  });

  it.each([
    { action: 'supply', amountToken: 0 },
    { action: 'supply', amountToken: 100000 },
    { action: 'withdraw', amountToken: 0 },
    { action: 'withdraw', amountToken: 50 },
    { action: 'borrow', amountToken: 0 },
    { action: 'borrow', amountToken: 100 },
    { action: 'repay', amountToken: 100 },
    { action: 'repay', amountToken: 0 },
  ] as { action: AccountDataProps['action']; amountToken: number }[])(
    'renders correct values: %s',
    async ({ action, amountToken }) => {
      const { container } = renderComponent(
        <AccountData
          asset={poolData[0].assets[0]}
          pool={poolData[0]}
          action={action}
          amountTokens={new BigNumber(amountToken)}
        />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );

  it.each([
    { action: 'supply' },
    { action: 'withdraw' },
    { action: 'borrow' },
    { action: 'repay' },
  ] as { action: AccountDataProps['action'] }[])(
    'renders correct values when using swap: %s',
    async ({ action }) => {
      const { container } = renderComponent(
        <AccountData
          asset={poolData[0].assets[0]}
          pool={poolData[0]}
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
