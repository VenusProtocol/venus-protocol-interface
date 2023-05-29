/** @jsxImportSource @emotion/react */
import { Announcement, Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import { isTokenActionEnabled } from 'utilities';

import AssetAccessor from 'containers/AssetAccessor';

import BorrowForm from './BorrowForm';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawModal from './WithdrawForm';

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

  const tabsContent: TabContent[] = [];

  if (
    isTokenActionEnabled({
      token: vToken.underlyingToken,
      action: 'supply',
    })
  ) {
    tabsContent.push({
      title: t('operationModal.supplyTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.supply.connectWalletMessage')}
          approveTokenMessage={t('operationModal.supply.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfoType="supply"
        >
          {({ asset, pool }) => <SupplyForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    });
  }

  if (
    isTokenActionEnabled({
      token: vToken.underlyingToken,
      action: 'withdraw',
    })
  ) {
    tabsContent.push({
      title: t('operationModal.withdrawTabTitle'),
      content: (
        <WithdrawModal
          onClose={onClose}
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
        />
      ),
    });
  }

  if (
    isTokenActionEnabled({
      token: vToken.underlyingToken,
      action: 'borrow',
    })
  ) {
    tabsContent.push({
      title: t('operationModal.borrowTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.borrow.connectWalletMessage')}
          approveTokenMessage={t('operationModal.borrow.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfoType="borrow"
        >
          {({ asset, pool }) => <BorrowForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    });
  }

  if (
    isTokenActionEnabled({
      token: vToken.underlyingToken,
      action: 'repay',
    })
  ) {
    tabsContent.push({
      title: t('operationModal.repayTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationModal.repay.connectWalletMessage')}
          approveTokenMessage={t('operationModal.repay.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfoType="borrow"
        >
          {({ asset, pool }) => <RepayForm asset={asset} pool={pool} onCloseModal={onClose} />}
        </AssetAccessor>
      ),
    });
  }

  return (
    <Modal
      isOpen
      title={<TokenIconWithSymbol token={vToken.underlyingToken} variant="h4" />}
      handleClose={onClose}
    >
      <>
        <Announcement token={vToken.underlyingToken} />

        {tabsContent.length > 0 && (
          <Tabs tabsContent={tabsContent} initialActiveTabIndex={initialActiveTabIndex} />
        )}
      </>
    </Modal>
  );
};

export default OperationModal;
