import { getMarketTabId } from '..';

describe('getMarketTabId', () => {
  it('keeps the supply side tab', () => {
    expect(getMarketTabId({ side: 'supply', activeTabPath: ['withdraw'] })).toBe('withdraw');
    expect(getMarketTabId({ side: 'supply', activeTabPath: [] })).toBe('supply');
  });

  it('keeps the loan tab on the borrow side', () => {
    expect(getMarketTabId({ side: 'borrow', activeTabPath: ['loan', 'repay'] })).toBe('repay');
    expect(getMarketTabId({ side: 'borrow', activeTabPath: ['repay'] })).toBe('repay');
  });

  it('opens Borrow when a collateral tab is active', () => {
    expect(getMarketTabId({ side: 'borrow', activeTabPath: ['collateral', 'withdraw'] })).toBe(
      'borrow',
    );
  });
});
