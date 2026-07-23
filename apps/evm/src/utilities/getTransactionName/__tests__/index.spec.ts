import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { t } from 'libs/translations';
import type { LiquidityHubTx } from 'types';
import { getTransactionName } from '..';

describe('getTransactionName', () => {
  it('identifies Liquidity Hub transactions while keeping filter labels generic', () => {
    const [liquidityHub] = liquidityHubs;
    const transaction: LiquidityHubTx = {
      accountAddress: '0x1000000000000000000000000000000000000000',
      blockNumber: '1',
      blockTimestamp: new Date('2026-01-01T00:00:00.000Z'),
      chainId: liquidityHub.vhToken.chainId,
      contractAddress: liquidityHub.vhToken.address,
      hash: '0x1',
      txType: 'supply',
      vhToken: liquidityHub.vhToken,
    };

    expect(
      getTransactionName({
        transaction: 'supply',
        t,
      }),
    ).toBe('Supply');
    expect(
      getTransactionName({
        transaction,
        t,
      }),
    ).toBe('Supply • Liquidity Hub');
  });
});
