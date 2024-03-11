import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
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
    'renders correctly for core pool asset: %s',
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
    { action: 'supply', amountToken: 0 },
    { action: 'supply', amountToken: 100000 },
    { action: 'withdraw', amountToken: 0 },
    { action: 'withdraw', amountToken: 50 },
    { action: 'borrow', amountToken: 0 },
    { action: 'borrow', amountToken: 100 },
    { action: 'repay', amountToken: 100 },
    { action: 'repay', amountToken: 0 },
  ] as { action: AccountDataProps['action']; amountToken: number }[])(
    'renders correctly for isolated pool asset: %s',
    async ({ action, amountToken }) => {
      const { container } = renderComponent(
        <AccountData
          asset={poolData[1].assets[0]}
          pool={poolData[1]}
          action={action}
          amountTokens={new BigNumber(amountToken)}
        />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
