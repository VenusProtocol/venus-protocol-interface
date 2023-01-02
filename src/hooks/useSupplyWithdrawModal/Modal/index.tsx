/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Asset, VToken } from 'types';
import { isTokenEnabled } from 'utilities';

import { useGetAsset, useGetMainAssets } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import SupplyModal from './Supply';
import WithdrawModal from './Withdraw';

export interface SupplyWithdrawProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
}

export interface SupplyWithdrawUiProps extends Omit<SupplyWithdrawProps, 'token'> {
  assets: Asset[];
  asset?: Asset;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawUi: React.FC<SupplyWithdrawUiProps> = ({ vToken, onClose, asset }) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('supplyWithdraw.withdraw'),
      content: <WithdrawModal onClose={onClose} vToken={vToken} />,
    },
  ];

  // Prevent user from being able to supply UST or LUNA
  if (asset && isTokenEnabled(asset.vToken.underlyingToken)) {
    tabsContent.unshift({
      title: t('supplyWithdraw.supply'),
      content: <SupplyModal onClose={onClose} vToken={vToken} />,
    });
  }

  return (
    <Modal
      isOpen={!!asset}
      handleClose={onClose}
      title={asset && <TokenIconWithSymbol token={asset.vToken.underlyingToken} variant="h4" />}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

const SupplyWithdrawModal: React.FC<SupplyWithdrawProps> = ({ vToken, onClose }) => {
  const { account } = useContext(AuthContext);

  const { data: getAssetData } = useGetAsset({ vToken, accountAddress: account?.address });

  const { data: getMainAssetsData } = useGetMainAssets({
    accountAddress: account?.address,
  });

  return (
    <SupplyWithdrawUi
      onClose={onClose}
      vToken={vToken}
      asset={getAssetData?.asset}
      assets={getMainAssetsData?.assets || []}
    />
  );
};

export default SupplyWithdrawModal;
