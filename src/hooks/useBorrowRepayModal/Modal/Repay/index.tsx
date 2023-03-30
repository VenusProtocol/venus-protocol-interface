/** @jsxImportSource @emotion/react */
import { ConnectWallet, EnableToken, Spinner } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import { areTokensEqual } from 'utilities';

import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useAssetInfo from 'hooks/useAssetInfo';

import RepayForm from './RepayForm';

export interface RepayProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  onClose: () => void;
}

// TODO: build into a reusable wrapper for the supply, withdraw, borrow and
// repay forms
const Repay: React.FC<RepayProps> = ({ vToken, poolComptrollerAddress, onClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  const assetInfo = useAssetInfo({
    asset,
    type: 'borrow',
  });

  return (
    <ConnectWallet message={t('borrowRepayModal.repay.connectWalletMessage')}>
      {asset && pool ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={t('borrowRepayModal.repay.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfo={assetInfo}
        >
          <RepayForm asset={asset} pool={pool} onCloseModal={onClose} />
        </EnableToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default Repay;
