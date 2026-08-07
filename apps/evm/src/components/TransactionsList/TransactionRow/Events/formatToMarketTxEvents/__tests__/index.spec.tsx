import { usdt } from '__mocks__/models/tokens';
import { vUsdtCorePool } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import type { useTranslation } from 'libs/translations';
import type { MarketTx } from 'types';
import { formatToMarketTxEvents } from '..';

describe('formatToMarketTxEvents', () => {
  it('formats amount descriptions without repeating the token symbol', () => {
    const Trans = vi.fn() as unknown as ReturnType<typeof useTranslation>['Trans'];
    const transaction: MarketTx = {
      accountAddress: '0x1000000000000000000000000000000000000000',
      amounts: [
        {
          amountCents: 2406931.018168455,
          amountTokens: new BigNumber('24066181578079398.612862'),
          token: usdt,
        },
      ],
      blockNumber: '1',
      blockTimestamp: new Date('2026-01-01T00:00:00.000Z'),
      chainId: vUsdtCorePool.chainId,
      contractAddress: vUsdtCorePool.address,
      hash: '0x1',
      poolName: 'Metaverse',
      txType: 'withdraw',
      vToken: vUsdtCorePool,
    };

    const [event] = formatToMarketTxEvents({
      transaction,
      Trans,
    });

    expect(event.description).toBe('$24.06K • Metaverse');
  });
});
