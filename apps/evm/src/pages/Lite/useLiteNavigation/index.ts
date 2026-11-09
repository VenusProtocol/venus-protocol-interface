import { useLocation, useNavigate, useSearchParams } from 'react-router';
import type { MarketMode } from '../types';
import { applyParamChanges } from './applyParamChanges';
import { toModeParam } from './toModeParam';

const MODE_PARAM = 'tab';
const ASSET_PARAM = 'asset';
const MARKET_PARAM = 'market';

type ParamChanges = Record<string, string | undefined>;

export const useLiteNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const mode: MarketMode = searchParams.get(MODE_PARAM) === 'borrow' ? 'borrow' : 'earn';
  const depth: number = typeof state?.liteDepth === 'number' ? state.liteDepth : 0;

  const replace = (changes: ParamChanges, nextDepth = depth) =>
    setSearchParams(previous => applyParamChanges({ previous, changes }), {
      replace: true,
      state: { ...state, liteDepth: nextDepth },
    });

  const open = (changes: ParamChanges) =>
    setSearchParams(previous => applyParamChanges({ previous, changes }), {
      state: { ...state, liteDepth: depth + 1 },
    });

  const goBack = ({ steps, changes }: { steps: number; changes: ParamChanges }) =>
    steps > 0 && depth >= steps ? navigate(-steps) : replace(changes);

  return {
    mode,
    assetSymbol: searchParams.get(ASSET_PARAM) ?? undefined,
    marketSlug: searchParams.get(MARKET_PARAM) ?? undefined,
    setMode: (nextMode: MarketMode) =>
      replace(
        {
          [MODE_PARAM]: toModeParam(nextMode),
          [ASSET_PARAM]: undefined,
          [MARKET_PARAM]: undefined,
        },
        0,
      ),
    selectAsset: (symbol: string | undefined, nextMode?: MarketMode) => {
      const changes = {
        [MODE_PARAM]: nextMode ? toModeParam(nextMode) : toModeParam(mode),
        [ASSET_PARAM]: symbol,
        [MARKET_PARAM]: undefined,
      };

      return symbol ? open(changes) : goBack({ steps: depth, changes });
    },
    selectMarket: (marketSlug: string | undefined) => {
      const changes = { [MARKET_PARAM]: marketSlug };

      return marketSlug ? open(changes) : goBack({ steps: 1, changes });
    },
  };
};
