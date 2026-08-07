import { useCallback } from 'react';

import { routes } from 'constants/routing';
import { useStore as useMarketFormModalHostStore } from 'containers/MarketFormModalHost/store';
import { useChain } from 'hooks/useChain';
import { useNavigate } from 'hooks/useNavigate';

export interface UseChatActionOutput {
  dispatchAction: (action: string) => void;
  openUrl: (url: string) => void;
}

/**
 * Executes the bot's in-app "action" CTAs:
 *  - market:SYMBOL[:tab] — go to the core pool markets page and pop that
 *    market's operations modal (e.g. recommending USDT supply)
 *  - vault:SYMBOL — go to the Vaults page and pop that vault's modal
 *    (fixed-rate vaults, XVS/VAI staking)
 *  - prime — go to the Venus Prime page
 *  - page:NAME — navigate to an app page (dashboard, markets, vaults, …)
 *
 * openUrl handles the bot's url CTAs: app.venus.io links are converted to
 * in-app navigation instead of popping a new tab; anything else opens
 * externally.
 */
export const useChatAction = (): UseChatActionOutput => {
  const { navigate } = useNavigate();
  const { corePoolComptrollerContractAddress } = useChain();
  const openMarketFormModal = useMarketFormModalHostStore(state => state.openModal);

  const dispatchAction = useCallback(
    (action: string) => {
      const [kind, name, tab] = action.split(':');

      if (kind === 'prime') {
        navigate(routes.primeLeaderboard.path);
        return;
      }

      if (kind === 'page' && name) {
        const pagePaths: Record<string, string> = {
          dashboard: routes.dashboard.path,
          markets: routes.markets.path.replace(
            ':poolComptrollerAddress',
            corePoolComptrollerContractAddress,
          ),
          vaults: routes.vaults.path,
          governance: routes.governance.path,
          bridge: routes.bridge.path,
          swap: routes.swap.path,
        };
        const pagePath = pagePaths[name];
        if (pagePath) {
          navigate(pagePath);
        }
        return;
      }

      if (kind === 'vault' && name) {
        navigate(`${routes.vaults.path}?vault=${encodeURIComponent(name)}`);
        return;
      }

      if (kind === 'market' && name) {
        navigate(
          routes.markets.path.replace(
            ':poolComptrollerAddress',
            corePoolComptrollerContractAddress,
          ),
        );
        openMarketFormModal({
          underlyingSymbol: name,
          poolComptrollerAddress: corePoolComptrollerContractAddress,
          initialActiveTabId: tab,
        });
      }
    },
    [corePoolComptrollerContractAddress, navigate, openMarketFormModal],
  );

  const openUrl = useCallback(
    (url: string) => {
      let hashPath: string | undefined;
      try {
        const parsed = new URL(url);
        if (parsed.hostname === 'app.venus.io') {
          hashPath = parsed.hash.replace(/^#/, '').split('?')[0] || '/';
        }
      } catch {
        // not a valid absolute URL — fall through to window.open
      }

      if (hashPath) {
        const actionByPathPrefix: Array<[string, string]> = [
          ['/dashboard', 'page:dashboard'],
          ['/vaults', 'page:vaults'],
          ['/governance', 'page:governance'],
          ['/bridge', 'page:bridge'],
          ['/swap', 'page:swap'],
          ['/core-pool', 'page:markets'],
          ['/markets', 'page:markets'],
          ['/prime', 'prime'],
          ['/', 'page:dashboard'],
        ];
        const match = actionByPathPrefix.find(([prefix]) =>
          prefix === '/' ? hashPath === '/' : hashPath?.startsWith(prefix),
        );
        if (match) {
          dispatchAction(match[1]);
          return;
        }
      }

      window.open(url, '_blank', 'noreferrer');
    },
    [dispatchAction],
  );

  return { dispatchAction, openUrl };
};
