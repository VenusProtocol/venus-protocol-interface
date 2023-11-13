/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'packages/translations';
import React from 'react';
import { VToken } from 'types';

import AssetAccessor from 'containers/AssetAccessor';

import BorrowForm from './BorrowForm';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawForm from './WithdrawForm';

export interface OperationModalProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
  initialActiveTabIndex?: number;
}

const OperationModal: React.FC<OperationModalProps> = ({
  onClose,
  vToken,
  poolComptrollerAddress,
  initialActiveTabIndex = 0,
}) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('operationModal.supplyTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.supply.connectWalletMessage')}
          action="supply"
        >
          {({ asset, pool }) => <SupplyForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationModal.withdrawTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.withdraw.connectWalletMessage')}
          action="withdraw"
        >
          {({ asset, pool }) => <WithdrawForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationModal.borrowTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.borrow.connectWalletMessage')}
          action="borrow"
        >
          {({ asset, pool }) => <BorrowForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationModal.repayTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.repay.connectWalletMessage')}
          action="repay"
        >
          {({ asset, pool }) => <RepayForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    },
  ];

  return (
    <Modal
      isOpen
      title={<TokenIconWithSymbol token={vToken.underlyingToken} variant="h4" />}
      handleClose={onClose}
    >
      <Tabs tabsContent={tabsContent} initialActiveTabIndex={initialActiveTabIndex} />
    </Modal>
  );
};

export default OperationModal;
