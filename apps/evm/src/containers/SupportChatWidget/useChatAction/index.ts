import { useCallback } from 'react';

import { routes } from 'constants/routing';
import { useStore as useMarketFormModalHostStore } from 'containers/MarketFormModalHost/store';
import { useChain } from 'hooks/useChain';
import { useNavigate } from 'hooks/useNavigate';

export interface UseChatActionOutput {
  dispatchAction: (action: string) => void;
}

/**
 * Executes the bot's in-app "action" CTAs:
 *  - market:SYMBOL[:tab] — go to the core pool markets page and pop that
 *    market's operations modal (e.g. recommending USDT supply)
 *  - vault:SYMBOL — go to the Vaults page and pop that vault's modal
 *    (fixed-rate vaults, XVS/VAI staking)
 *  - prime — go to the Venus Prime page
 */
export const useChatAction = (): UseChatActionOutput => {
  const { navigate } = useNavigate();
  const { corePoolComptrollerContractAddress } = useChain();
  const openMarketFormModal = useMarketFormModalHostStore(state => state.openModal);

  const dispatchAction = useCallback(
    (action: string) => {
      const [kind, symbol, tab] = action.split(':');

      if (kind === 'prime') {
        navigate(routes.primeLeaderboard.path);
        return;
      }

      if (kind === 'vault' && symbol) {
        navigate(`${routes.vaults.path}?vault=${encodeURIComponent(symbol)}`);
        return;
      }

      if (kind === 'market' && symbol) {
        navigate(
          routes.markets.path.replace(
            ':poolComptrollerAddress',
            corePoolComptrollerContractAddress,
          ),
        );
        openMarketFormModal({
          underlyingSymbol: symbol,
          poolComptrollerAddress: corePoolComptrollerContractAddress,
          initialActiveTabId: tab,
        });
      }
    },
    [corePoolComptrollerContractAddress, navigate, openMarketFormModal],
  );

  return { dispatchAction };
};
