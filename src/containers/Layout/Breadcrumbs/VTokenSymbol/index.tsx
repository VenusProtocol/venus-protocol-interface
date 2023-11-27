import { Icon, TertiaryButton } from 'components';
import { addTokenToWallet, canAddTokenToWallet, useAccountAddress } from 'packages/wallet';
import { useMemo } from 'react';
import { VToken } from 'types';
import { findTokenByAddress } from 'utilities';

import { useGetVTokens } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

export interface VTokenSymbolUiProps {
  vToken?: VToken;
  isUserConnected: boolean;
}

export const VTokenSymbolUi: React.FC<VTokenSymbolUiProps> = ({ vToken, isUserConnected }) => (
  <div className="inline-flex items-center">
    <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>

    {isUserConnected && vToken && canAddTokenToWallet() && (
      <TertiaryButton
        className="ml-4 h-auto border-cards bg-cards p-1 text-blue hover:text-offWhite"
        onClick={() => addTokenToWallet(vToken.underlyingToken)}
      >
        <Icon name="wallet" className="ml-[1px] h-5 w-5 text-inherit " />
      </TertiaryButton>
    )}
  </div>
);

export interface VTokenSymbolProps {
  vTokenAddress?: string;
}

const VTokenSymbol: React.FC<VTokenSymbolProps> = ({ vTokenAddress }) => {
  const { accountAddress } = useAccountAddress();
  const { data: getVTokensData } = useGetVTokens();

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

  return <VTokenSymbolUi vToken={vToken} isUserConnected={!!accountAddress} />;
};

export default VTokenSymbol;
