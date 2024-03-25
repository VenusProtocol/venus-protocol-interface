/** @jsxImportSource @emotion/react */
import { Modal, type ModalProps, type TabContent, Tabs, TokenIconWithSymbol } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import { useTranslation } from 'libs/translations';
import type { VToken } from 'types';

import BorrowForm from './BorrowForm';
import NativeTokenBalanceWrapper from './NativeTokenBalanceWrapper';
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
          {({ asset, pool }) => (
            <NativeTokenBalanceWrapper asset={asset} pool={pool}>
              {({ asset, pool, userWalletNativeTokenBalanceData }) => (
                <SupplyForm
                  asset={asset}
                  pool={pool}
                  userWalletNativeTokenBalanceData={userWalletNativeTokenBalanceData}
                  onCloseModal={onClose}
                />
              )}
            </NativeTokenBalanceWrapper>
          )}
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
          {({ asset, pool }) => (
            <NativeTokenBalanceWrapper asset={asset} pool={pool}>
              {({ asset, pool, userWalletNativeTokenBalanceData }) => (
                <RepayForm
                  asset={asset}
                  pool={pool}
                  userWalletNativeTokenBalanceData={userWalletNativeTokenBalanceData}
                  onCloseModal={onClose}
                />
              )}
            </NativeTokenBalanceWrapper>
          )}
        </AssetAccessor>
      ),
    },
  ];

  return (
    <Modal
      isOpen
      title={
        <TokenIconWithSymbol token={vToken.underlyingToken} className="text-lg font-semibold" />
      }
      handleClose={onClose}
    >
      <Tabs tabsContent={tabsContent} initialActiveTabIndex={initialActiveTabIndex} />
    </Modal>
  );
};

export default OperationModal;
