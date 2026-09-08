import config from 'config';
import { useAccountChainId, useChainId } from 'libs/wallet';
import { useEffect, useRef } from 'react';
import { NavigationType, useNavigationType, useSearchParams } from 'react-router';

import { FILTER_PARAM_KEYS } from '../../constants';
import { deleteFilterSearchParams } from '../../utilities/deleteFilterSearchParams';

// Vaults are chain specific, so a selection made on one chain rarely matches anything on
// the next one: clear the filters whenever the chain changes.
//
// This lives on the page rather than on VaultList because VaultList is unmounted while the
// new chain's vaults load, which would lose track of the chain the filters were picked on.
export const useResetFiltersOnChainChange = () => {
  const { chainId } = useChainId();
  const { chainId: accountChainId } = useAccountChainId();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();

  // In the Safe app the active chain comes from the wallet and only resolves after the
  // first render, until when useChainId falls back to the default chain: that fallback is
  // not a chain the user picked. Seeded with the current chain rather than reusing
  // usePrevious, whose ref starts undefined and would report a change on the first render
  const previousChainIdRef = useRef(config.isSafeApp && !accountChainId ? undefined : chainId);

  useEffect(() => {
    if (previousChainIdRef.current === chainId) {
      return;
    }

    const isFirstResolvedChainId = previousChainIdRef.current === undefined;
    previousChainIdRef.current = chainId;

    if (isFirstResolvedChainId) {
      return;
    }

    // A back or forward navigation restores the filters that belong to the history entry it
    // lands on, so there is nothing to reset. In the Safe app the chain comes from the
    // wallet rather than from a navigation, so the navigation type says nothing about it
    if (!config.isSafeApp && navigationType === NavigationType.Pop) {
      return;
    }

    if (!FILTER_PARAM_KEYS.some(key => searchParams.has(key))) {
      return;
    }

    // Consistent with the filter controls themselves, which replace the current history
    // entry rather than pushing a new one
    setSearchParams(deleteFilterSearchParams, { replace: true });
  }, [chainId, navigationType, searchParams, setSearchParams]);
};
