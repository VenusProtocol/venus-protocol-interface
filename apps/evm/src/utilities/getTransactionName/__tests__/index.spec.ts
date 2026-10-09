import { t } from 'libs/translations';
import type { TxType } from 'types';
import { getTransactionName } from '..';

describe('getTransactionName', () => {
  it.each([
    ['supply', 'Supply • Venus Core'],
    ['repay', 'Repay • Venus Core'],
    ['borrow', 'Borrow • Venus Core'],
    ['withdraw', 'Withdraw • Venus Core'],
    ['exitMarket', 'Disable collateral • Venus Core'],
    ['enterMarket', 'Enable collateral • Venus Core'],
    ['hubSupply', 'Supply • Liquidity Hub'],
    ['hubSupplyFromCollateral', 'Migrate • Liquidity Hub'],
    ['hubWithdraw', 'Withdraw • Liquidity Hub'],
    ['principalSupplied', 'Supply • Trade'],
    ['principalWithdrawn', 'Withdraw • Trade'],
    ['positionOpened', 'Opened • Trade'],
    ['profitConverted', 'Realized PnL • Trade'],
    ['positionClosedWithProfit', 'Close (profit) • Trade'],
    ['positionClosedWithLoss', 'Close (loss) • Trade'],
    ['positionIncreased', 'Increase • Trade'],
    ['positionReducedWithLoss', 'Reduced (loss) • Trade'],
    ['positionReducedWithProfit', 'Reduced (profit) • Trade'],
  ] satisfies [TxType, string][])('formats %s', (type, expectedName) => {
    expect(
      getTransactionName({
        type,
        t,
      }),
    ).toBe(expectedName);
  });

  it.each([
    ['supply', 'Supply • Venus Spoke'],
    ['borrow', 'Borrow • Venus Spoke'],
    ['repay', 'Repay • Venus Spoke'],
    ['withdraw', 'Withdraw • Venus Spoke'],
    ['enterMarket', 'Enable collateral • Venus Spoke'],
  ] satisfies [TxType, string][])(
    'names %s on a Spoke market after Venus Spoke',
    (type, expectedName) => {
      expect(getTransactionName({ type, t, isSpoke: true })).toBe(expectedName);
    },
  );
});
