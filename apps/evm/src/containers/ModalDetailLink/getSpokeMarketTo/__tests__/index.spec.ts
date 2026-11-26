import { getSpokeMarketTo } from '..';

const input = {
  spokePoolComptrollerAddress: '0x0000000000000000000000000000000000000001',
  spokeVTokenAddress: '0x0000000000000000000000000000000000000002',
} as const;

describe('getSpokeMarketTo', () => {
  it('keeps the outer and inner tabs', () => {
    expect(getSpokeMarketTo({ ...input, activeTabPath: ['loan', 'repay'] })).toEqual({
      pathname: `/spoke/${input.spokePoolComptrollerAddress}/${input.spokeVTokenAddress}`,
      search: 'tab=loan&subTab=repay',
    });
  });

  it('derives the outer tab when the modal shows only one side', () => {
    expect(getSpokeMarketTo({ ...input, activeTabPath: ['withdraw'] })).toMatchObject({
      search: 'tab=collateral&subTab=withdraw',
    });

    expect(getSpokeMarketTo({ ...input, activeTabPath: ['borrow'] })).toMatchObject({
      search: 'tab=loan&subTab=borrow',
    });
  });

  it('carries no tab when none is known', () => {
    expect(getSpokeMarketTo({ ...input, activeTabPath: [] })).toMatchObject({ search: '' });
  });
});
