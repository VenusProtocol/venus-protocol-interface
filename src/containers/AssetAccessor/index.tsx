/** @jsxImportSource @emotion/react */
import { ApproveToken, ConnectWallet, Spinner } from 'components';
import React from 'react';
import { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual, isTokenActionEnabled } from 'utilities';

import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useAssetInfo from 'hooks/useAssetInfo';

import DisabledActionNotice from './DisabledActionNotice';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  connectWalletMessage: string;
  approveTokenMessage: string;
  action: TokenAction;
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  connectWalletMessage,
  approveTokenMessage,
  action,
}) => {
  const { accountAddress } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  const assetInfo = useAssetInfo({
    asset,
    type: action === 'supply' || action === 'withdraw' ? 'supply' : 'borrow',
  });

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
      {pool && asset ? (
        <ApproveToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={approveTokenMessage}
          assetInfo={assetInfo}
        >
          {children({ asset, pool })}
        </ApproveToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default AssetAccessor;
