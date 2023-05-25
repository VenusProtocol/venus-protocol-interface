/** @jsxImportSource @emotion/react */
import { ConnectWallet, EnableToken, Spinner } from 'components';
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
  enableTokenMessage: string;
  assetInfoType: 'supply' | 'borrow';
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  connectWalletMessage,
  enableTokenMessage,
  assetInfoType,
}) => {
  const { accountAddress } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  console.log(pool?.assets);

  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  const assetInfo = useAssetInfo({
    asset,
    type: assetInfoType,
  });

  return (
    <ConnectWallet message={connectWalletMessage}>
      {pool && asset ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={enableTokenMessage}
          assetInfo={assetInfo}
        >
          {children({ asset, pool })}
        </EnableToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default AssetAccessor;
