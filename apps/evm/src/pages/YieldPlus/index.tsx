import {
  useGetYieldPlusPairPrice,
  useGetYieldPlusPairs,
  useGetYieldPlusPositions,
  useGetYieldPlusTransactions,
} from 'clients/api';
import { Page, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo, useState } from 'react';
import type { Token } from 'types';

import { CollateralForm } from './components/CollateralForm';
import { PairStatsBar } from './components/PairStatsBar';
import { PositionForm } from './components/PositionForm';
import { PositionsTable } from './components/PositionsTable';
import { TokenPairSelector } from './components/TokenPairSelector';
import { TradingViewChart } from './components/TradingViewChart';
import { TransactionsTable } from './components/TransactionsTable';
import { YieldPlusBanner } from './components/YieldPlusBanner';

const YieldPlusPage: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  // ── Pair + side state ────────────────────────────────────────────────
  const [side, setSide] = useState<'long' | 'short'>('long');

  const { data: pairsData } = useGetYieldPlusPairs();
  const pairs = pairsData?.pairs ?? [];

  const defaultLongToken: Token | undefined = pairs[0]?.longToken;
  const defaultShortToken: Token | undefined = pairs[0]?.shortToken;

  const [longToken, setLongToken] = useState<Token | undefined>(defaultLongToken);
  const [shortToken, setShortToken] = useState<Token | undefined>(defaultShortToken);

  // Resolved tokens: fall back to pair defaults once data loads
  const resolvedLongToken = longToken ?? defaultLongToken;
  const resolvedShortToken = shortToken ?? defaultShortToken;

  // Update selections when pairs load
  const activeLongToken = resolvedLongToken ?? pairs[0]?.longToken;
  const activeShortToken = resolvedShortToken ?? pairs[0]?.shortToken;

  // ── Selected pair stats ──────────────────────────────────────────────
  const activePair = useMemo(() => {
    if (!activeLongToken || !activeShortToken) return pairs[0];
    return (
      pairs.find(
        p =>
          p.longToken.symbol === activeLongToken.symbol &&
          p.shortToken.symbol === activeShortToken.symbol,
      ) ?? pairs[0]
    );
  }, [pairs, activeLongToken, activeShortToken]);

  // ── Chart data ───────────────────────────────────────────────────────
  const { data: priceData } = useGetYieldPlusPairPrice(
    {
      longTokenSymbol: activeLongToken?.symbol ?? 'LINK',
      shortTokenSymbol: activeShortToken?.symbol ?? 'CAKE',
    },
    { enabled: !!activeLongToken && !!activeShortToken },
  );

  // ── Positions / transactions ──────────────────────────────────────────
  const { data: positionsData, isLoading: isLoadingPositions } = useGetYieldPlusPositions({
    accountAddress,
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useGetYieldPlusTransactions({
    accountAddress,
  });

  // ── Token lists for selector ─────────────────────────────────────────
  const longTokenOptions: Token[] = useMemo(
    () =>
      pairs
        .map(p => p.longToken)
        .filter((t, i, arr) => arr.findIndex(x => x.symbol === t.symbol) === i),
    [pairs],
  );

  const shortTokenOptions: Token[] = useMemo(
    () =>
      pairs
        .map(p => p.shortToken)
        .filter((t, i, arr) => arr.findIndex(x => x.symbol === t.symbol) === i),
    [pairs],
  );

  // ── Bottom tabs (Positions / Transactions) ───────────────────────────
  const bottomTabs = useMemo(
    () => [
      {
        id: 'positions',
        title: t('yieldPlus.tabs.positions'),
        content: (
          <PositionsTable
            positions={positionsData?.positions ?? []}
            isLoading={isLoadingPositions}
            accountAddress={accountAddress}
          />
        ),
      },
      {
        id: 'transactions',
        title: t('yieldPlus.tabs.transactions'),
        content: (
          <TransactionsTable
            transactions={transactionsData?.transactions ?? []}
            isLoading={isLoadingTransactions}
            accountAddress={accountAddress}
          />
        ),
      },
    ],
    [t, positionsData, isLoadingPositions, transactionsData, isLoadingTransactions, accountAddress],
  );

  // ── Right panel tabs (Position / Collateral) ─────────────────────────
  const rightPanelTabs = useMemo(
    () => [
      {
        id: 'position',
        title: t('yieldPlus.tabs.position'),
        content:
          activeLongToken && activeShortToken ? (
            <PositionForm side={side} longToken={activeLongToken} shortToken={activeShortToken} />
          ) : null,
      },
      {
        id: 'collateral',
        title: t('yieldPlus.tabs.collateral'),
        content: activeLongToken ? <CollateralForm collateralToken={activeLongToken} /> : null,
      },
    ],
    [t, side, activeLongToken, activeShortToken],
  );

  return (
    <Page>
      <div className="max-w-[1296px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* Token pair selector + stats in bordered container */}
            <div className="border border-dark-blue-hover rounded-lg p-4 flex flex-col gap-6">
              {longTokenOptions.length > 0 && activeLongToken && activeShortToken && (
                <TokenPairSelector
                  side={side}
                  onSideChange={setSide}
                  longToken={activeLongToken}
                  shortToken={activeShortToken}
                  longTokenOptions={longTokenOptions}
                  shortTokenOptions={shortTokenOptions}
                  onLongTokenChange={token => setLongToken(token)}
                  onShortTokenChange={token => setShortToken(token)}
                />
              )}

              {activePair && activeLongToken && activeShortToken && (
                <PairStatsBar
                  longToken={activeLongToken}
                  shortToken={activeShortToken}
                  price={activePair.price}
                  priceChange24h={activePair.priceChange24h}
                  longLiquidity={activePair.longLiquidity}
                  shortLiquidity={activePair.shortLiquidity}
                  supplyApy={activePair.supplyApy}
                  borrowApy={activePair.borrowApy}
                />
              )}
            </div>

            {/* Candlestick chart */}
            <TradingViewChart
              candles={priceData?.candles ?? []}
              symbol={
                activeLongToken && activeShortToken
                  ? `${activeLongToken.symbol}/${activeShortToken.symbol}`
                  : undefined
              }
            />

            {/* Positions / Transactions tabs */}
            <Tabs tabs={bottomTabs} variant="secondary" />
          </div>

          {/* ── Right column ─────────────────────────────────────────── */}
          <div className="xl:w-[411px] shrink-0 flex flex-col gap-4">
            <YieldPlusBanner />

            <div className="bg-cards rounded-xl p-6">
              <Tabs tabs={rightPanelTabs} variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default YieldPlusPage;
