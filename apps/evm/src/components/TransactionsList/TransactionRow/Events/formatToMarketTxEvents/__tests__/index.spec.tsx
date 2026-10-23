import { usdt } from '__mocks__/models/tokens';
import { vUsdtCorePool } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { en, useTranslation } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
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

  const enterMarketTx: MarketTx = {
    accountAddress: '0x1000000000000000000000000000000000000000',
    blockNumber: '1',
    blockTimestamp: new Date('2026-01-01T00:00:00.000Z'),
    chainId: vUsdtCorePool.chainId,
    contractAddress: vUsdtCorePool.address,
    hash: '0x1',
    poolName: 'Hub-funded spoke',
    txType: 'enterMarket',
    vToken: vUsdtCorePool,
    isSpoke: true,
  };

  const EventTitle: React.FC<{ transaction: MarketTx }> = ({ transaction }) => {
    const { Trans } = useTranslation();
    const [event] = formatToMarketTxEvents({ transaction, Trans });

    return <>{event.title}</>;
  };

  it.each([
    ['enterMarket', 'Entered USDT market'],
    ['exitMarket', 'Exited USDT market'],
  ] as const)('describes %s on a Spoke loan market as entering or leaving it', (txType, text) => {
    const { container } = renderComponent(
      <EventTitle transaction={{ ...enterMarketTx, txType, isSpokeLoanMarket: true }} />,
    );

    expect(container.textContent).toBe(text);
  });

  it('keeps describing a Spoke collateral as enabled collateral', () => {
    const { container } = renderComponent(
      <EventTitle transaction={{ ...enterMarketTx, isSpokeLoanMarket: false }} />,
    );

    expect(container.textContent).toBe(
      en.account.transactions.txText.enterMarket
        .replace(/<\/?Styled>/g, '')
        .replace('{{vTokenSymbol}}', 'USDT'),
    );
  });
});
