/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { VToken } from 'types';
import { findTokenByAddress } from 'utilities';

import { useGetVTokens } from 'clients/api';
import addTokenToWallet, { canRegisterToken } from 'clients/web3/addTokenToWallet';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useAuth } from 'context/AuthContext';

import { TertiaryButton } from '../../../../Button';
import { Icon } from '../../../../Icon';
import { useStyles } from './styles';

export interface VTokenSymbolUiProps {
  vToken?: VToken;
  isUserConnected: boolean;
}

export const VTokenSymbolUi: React.FC<VTokenSymbolUiProps> = ({ vToken, isUserConnected }) => {
  const styles = useStyles();

  return (
    <div css={styles.tokenSymbol}>
      <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>

      {isUserConnected && vToken && canRegisterToken() && (
        <TertiaryButton
          css={styles.addTokenButton}
          onClick={() => addTokenToWallet(vToken.underlyingToken)}
        >
          <Icon name="wallet" css={styles.walletIcon} />
        </TertiaryButton>
      )}
    </div>
  );
};

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
