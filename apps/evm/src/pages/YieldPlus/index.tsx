import { useGetPools } from 'clients/api';
import { Page } from 'components';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { useMemo, useState } from 'react';
import type { Token } from 'types';

import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';

const YieldPlusPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const isWalletConnected = !!accountAddress;

  const { data: getPoolsData } = useGetPools({ accountAddress });

  const allTokens = useGetTokens();
  const defaultBnb = useGetToken({ symbol: 'BNB' });
  const defaultUsdt = useGetToken({ symbol: 'USDT' });

  const availableTokens = useMemo<Token[]>(() => {
    const tokenMap = new Map<string, Token>();

    for (const pool of getPoolsData?.pools ?? []) {
      for (const asset of pool.assets) {
        const address = asset.vToken.underlyingToken.address.toLowerCase();
        if (!tokenMap.has(address)) {
          tokenMap.set(address, asset.vToken.underlyingToken);
        }
      }
    }

    // Fall back to chain token list if pools not loaded yet
    if (tokenMap.size === 0) {
      for (const token of allTokens) {
        tokenMap.set(token.address.toLowerCase(), token);
      }
    }

    return Array.from(tokenMap.values());
  }, [getPoolsData, allTokens]);

  const [longToken, setLongToken] = useState<Token | undefined>(undefined);
  const [shortToken, setShortToken] = useState<Token | undefined>(undefined);

  const resolvedLongToken = longToken ?? defaultBnb ?? availableTokens[0];
  const resolvedShortToken = shortToken ?? defaultUsdt ?? availableTokens[1] ?? availableTokens[0];

  if (!resolvedLongToken || !resolvedShortToken) {
    return <Page>{null}</Page>;
  }

  return (
    <Page>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <LeftPanel
          longToken={resolvedLongToken}
          shortToken={resolvedShortToken}
          availableTokens={availableTokens}
          onLongTokenChange={setLongToken}
          onShortTokenChange={setShortToken}
          isWalletConnected={isWalletConnected}
        />

        <RightPanel
          longToken={resolvedLongToken}
          shortToken={resolvedShortToken}
          availableCollateralTokens={availableTokens}
          isWalletConnected={isWalletConnected}
        />
      </div>
    </Page>
  );
};

export default YieldPlusPage;
