import { useMemo } from 'react';

import { useGetVTokens } from 'clients/api';
import { AddTokenToWalletButton } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { canAddTokenToWallet, useAccountAddress } from 'libs/wallet';
import { findTokenByAddress } from 'utilities';

export interface VTokenSymbolProps {
  vTokenAddress?: string;
}

const VTokenSymbol: React.FC<VTokenSymbolProps> = ({ vTokenAddress }) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const { data: getVTokensData } = useGetVTokens();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  const vToken = useMemo(
    () =>
      vTokenAddress
        ? findTokenByAddress({
            tokens: getVTokensData?.vTokens || [],
            address: vTokenAddress,
          })
        : undefined,
    [vTokenAddress, getVTokensData],
  );

  return (
    <div className="inline-flex items-center">
      <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>

      {!isNewMarketPageEnabled && isUserConnected && vToken && canAddTokenToWallet() && (
        <AddTokenToWalletButton token={vToken.underlyingToken} className="ml-4 bg-cards" />
      )}
    </div>
  );
};

export default VTokenSymbol;
