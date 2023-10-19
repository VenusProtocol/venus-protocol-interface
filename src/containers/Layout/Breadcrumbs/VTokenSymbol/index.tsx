import { Icon, TertiaryButton } from 'components';
import { useMemo } from 'react';
import { VToken } from 'types';
import { findTokenByAddress } from 'utilities';

import { useGetVTokens } from 'clients/api';
import addTokenToWallet, { canRegisterToken } from 'clients/web3/addTokenToWallet';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useAuth } from 'context/AuthContext';

export interface VTokenSymbolUiProps {
  vToken?: VToken;
  isUserConnected: boolean;
}

export const VTokenSymbolUi: React.FC<VTokenSymbolUiProps> = ({ vToken, isUserConnected }) => (
  <div className="inline-flex items-center">
    <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>

    {isUserConnected && vToken && canRegisterToken() && (
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
  const { accountAddress } = useAuth();
  const { data: getVTokensData } = useGetVTokens();

  const vTokens = getVTokensData?.vTokens || [];

  const vToken = useMemo(
    () =>
      vTokenAddress
        ? findTokenByAddress({
            tokens: vTokens,
            address: vTokenAddress,
          })
        : undefined,
    [vTokenAddress, vTokens],
  );

  return <VTokenSymbolUi vToken={vToken} isUserConnected={!!accountAddress} />;
};

export default VTokenSymbol;
