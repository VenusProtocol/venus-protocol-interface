import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { t } from 'libs/translations';
import type { LiquidityHubTx } from 'types';
import { formatToLiquidityHubTxEvents } from '..';

describe('formatToLiquidityHubTxEvents', () => {
  it('formats the underlying token amount and identifies Liquidity Hub as the source', () => {
    const [liquidityHub] = liquidityHubs;
    const transaction: LiquidityHubTx = {
      accountAddress: '0x1000000000000000000000000000000000000000',
      amounts: [
        {
          amountCents: 7150,
          amountTokens: new BigNumber(10),
          token: liquidityHub.vhToken.underlyingToken,
        },
      ],
      blockNumber: '1',
      blockTimestamp: new Date('2026-01-01T00:00:00.000Z'),
      chainId: liquidityHub.vhToken.chainId,
      contractAddress: liquidityHub.vhToken.address,
      hash: '0x1',
      txType: 'supply',
      vhToken: liquidityHub.vhToken,
    };

    const [event] = formatToLiquidityHubTxEvents({
      transaction,
      t,
    });

    expect(event.token).toBe(liquidityHub.vhToken.underlyingToken);
    expect(event.title).toBe('10 XVS');
    expect(event.description).toBe('$71.5 • XVS • Liquidity Hub');
  });
});
