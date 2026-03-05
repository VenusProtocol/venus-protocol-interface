import { cn } from '@venusprotocol/ui';
import type { Token } from 'types';

export interface TradingViewChartProps {
  longToken: Token;
  shortToken: Token;
  blockPointerEvents?: boolean;
  className?: string;
}

const EXCHANGE_PREFIX_MAP: Record<string, string> = {
  BNB: 'BINANCE',
  WBNB: 'BINANCE',
  BTC: 'BINANCE',
  BTCB: 'BINANCE',
  ETH: 'BINANCE',
  USDT: 'BINANCE',
  USDC: 'BINANCE',
  SOL: 'BINANCE',
  XRP: 'BINANCE',
};

const normalizeSymbol = (token: Token): string => {
  const s = token.symbol.toUpperCase().replace('W', '');
  if (s === 'BNB' || token.symbol.toUpperCase() === 'WBNB') return 'BNB';
  return token.symbol.toUpperCase();
};

const buildTradingViewSymbol = (longToken: Token, shortToken: Token): string => {
  const base = normalizeSymbol(longToken);
  const quote = normalizeSymbol(shortToken);
  const exchange = EXCHANGE_PREFIX_MAP[base] ?? 'BINANCE';
  return `${exchange}:${base}${quote}`;
};

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  longToken,
  shortToken,
  blockPointerEvents = false,
  className,
}) => {
  const symbol = buildTradingViewSymbol(longToken, shortToken);

  const src = [
    'https://www.tradingview.com/widgetembed/',
    `?symbol=${encodeURIComponent(symbol)}`,
    '&interval=15',
    '&theme=dark',
    '&style=1',
    '&locale=en',
    '&hide_side_toolbar=0',
    '&allow_symbol_change=1',
    '&save_image=0',
    '&calendar=0',
    '&hide_volume=0',
    '&support_host=https%3A%2F%2Fwww.tradingview.com',
  ].join('');

  return (
    <div
      className={cn('relative rounded-xl overflow-hidden border border-lightGrey', className)}
      style={{ height: 420 }}
    >
      <iframe
        key={symbol}
        src={src}
        title={`${symbol} chart`}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
      />
      {/* Transparent blocker prevents iframe from capturing pointer events when dropdowns are open */}
      {blockPointerEvents && <div className="absolute inset-0 z-10" />}
    </div>
  );
};
