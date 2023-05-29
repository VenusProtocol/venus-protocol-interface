/** @jsxImportSource @emotion/react */
import { ApproveToken, ConnectWallet, Spinner } from 'components';
import React from 'react';
import { Asset, Pool, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useAssetInfo from 'hooks/useAssetInfo';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  connectWalletMessage: string;
  approveTokenMessage: string;
  assetInfoType: 'supply' | 'borrow';
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  connectWalletMessage,
  approveTokenMessage,
  assetInfoType,
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
    type: assetInfoType,
  });

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
