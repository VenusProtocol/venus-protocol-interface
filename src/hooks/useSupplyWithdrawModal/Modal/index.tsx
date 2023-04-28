/** @jsxImportSource @emotion/react */
import { Announcement, Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import { isTokenEnabled } from 'utilities';

import AssetAccessor from 'containers/AssetAccessor';

import SupplyForm from './SupplyForm';
import WithdrawModal from './Withdraw';

export interface SupplyWithdrawProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawModal: React.FC<SupplyWithdrawProps> = ({
  vToken,
  onClose,
  poolComptrollerAddress,
}) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('supplyWithdrawModal.withdrawTabTitle'),
      content: (
        <WithdrawModal
          onClose={onClose}
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
        />
      ),
    },
  ];

  // Prevent user from being able to supply disabled tokens
  if (isTokenEnabled(vToken.underlyingToken)) {
    tabsContent.unshift({
      title: t('supplyWithdrawModal.supplyTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('supplyWithdrawModal.supply.connectWalletMessage')}
          enableTokenMessage={t('supplyWithdrawModal.supply.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfoType="supply"
        >
          {({ asset, pool }) => <SupplyForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    });
  }

  return (
    <Modal
      isOpen
      handleClose={onClose}
      title={<TokenIconWithSymbol token={vToken.underlyingToken} variant="h4" />}
    >
      <>
        <Announcement token={vToken.underlyingToken} />

        <Tabs tabsContent={tabsContent} />
      </>
    </Modal>
  );
};

export default SupplyWithdrawModal;
