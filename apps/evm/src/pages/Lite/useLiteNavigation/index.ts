import { useSearchParams } from 'react-router';
import type { MarketMode } from '../MarketExplorer/ModeSwitch';
import { applyParamChanges } from './applyParamChanges';

const MODE_PARAM = 'tab';
const ASSET_PARAM = 'asset';
const MARKET_PARAM = 'market';

const toModeParam = (mode: MarketMode) => (mode === 'earn' ? undefined : mode);

export const useLiteNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const mode: MarketMode = searchParams.get(MODE_PARAM) === 'borrow' ? 'borrow' : 'earn';

  const update = (changes: Record<string, string | undefined>) =>
    setSearchParams(previous => applyParamChanges({ previous, changes }), { replace: true });

  return {
    mode,
    assetSymbol: searchParams.get(ASSET_PARAM) ?? undefined,
    marketId: searchParams.get(MARKET_PARAM) ?? undefined,
    setMode: (nextMode: MarketMode) =>
      update({
        [MODE_PARAM]: toModeParam(nextMode),
        [ASSET_PARAM]: undefined,
        [MARKET_PARAM]: undefined,
      }),
    selectAsset: (symbol: string | undefined, nextMode?: MarketMode) =>
      update({
        [MODE_PARAM]: nextMode ? toModeParam(nextMode) : toModeParam(mode),
        [ASSET_PARAM]: symbol,
        [MARKET_PARAM]: undefined,
      }),
    selectMarket: (marketId: string | undefined) => update({ [MARKET_PARAM]: marketId }),
  };
};
