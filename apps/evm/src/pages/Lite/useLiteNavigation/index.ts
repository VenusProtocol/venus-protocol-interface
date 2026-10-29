import { useSearchParams } from 'react-router';
import type { MarketMode } from '../MarketExplorer/ModeSwitch';

const MODE_PARAM = 'tab';
const ASSET_PARAM = 'asset';
const MARKET_PARAM = 'market';

export const useLiteNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = (changes: Record<string, string | undefined>) =>
    setSearchParams(
      previous => {
        const next = new URLSearchParams(previous);

        Object.entries(changes).forEach(([key, value]) => {
          if (value === undefined) {
            next.delete(key);
            return;
          }

          next.set(key, value);
        });

        return next;
      },
      { replace: true },
    );

  const mode: MarketMode = searchParams.get(MODE_PARAM) === 'borrow' ? 'borrow' : 'earn';

  return {
    mode,
    assetSymbol: searchParams.get(ASSET_PARAM) ?? undefined,
    marketId: searchParams.get(MARKET_PARAM) ?? undefined,
    setMode: (nextMode: MarketMode) =>
      update({
        [MODE_PARAM]: nextMode === 'earn' ? undefined : nextMode,
        [ASSET_PARAM]: undefined,
        [MARKET_PARAM]: undefined,
      }),
    selectAsset: (symbol: string | undefined, nextMode?: MarketMode) =>
      update({
        [MODE_PARAM]:
          nextMode === undefined
            ? searchParams.get(MODE_PARAM) ?? undefined
            : nextMode === 'earn'
              ? undefined
              : nextMode,
        [ASSET_PARAM]: symbol,
        [MARKET_PARAM]: undefined,
      }),
    selectMarket: (marketId: string | undefined) => update({ [MARKET_PARAM]: marketId }),
  };
};
