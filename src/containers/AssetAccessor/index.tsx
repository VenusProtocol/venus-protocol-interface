/** @jsxImportSource @emotion/react */
import { ConnectWallet, Spinner } from 'components';
import React from 'react';
import { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual, isTokenActionEnabled } from 'utilities';

import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import DisabledActionNotice from './DisabledActionNotice';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  connectWalletMessage: string;
  action: TokenAction;
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  connectWalletMessage,
  action,
}) => {
  const { accountAddress } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  if (
    !isTokenActionEnabled({
      token: vToken.underlyingToken,
      action,
    })
  ) {
    return <DisabledActionNotice token={vToken.underlyingToken} action={action} />;
  }

  return (
    <ConnectWallet message={connectWalletMessage}>
      {pool && asset ? children({ asset, pool }) : <Spinner />}
    </ConnectWallet>
  );
};

export default AssetAccessor;
