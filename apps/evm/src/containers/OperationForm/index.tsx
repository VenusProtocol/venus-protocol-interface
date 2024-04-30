import { type ModalProps, type TabContent, Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import { useTranslation } from 'libs/translations';
import type { VToken } from 'types';

import BorrowForm from './BorrowForm';
import NativeTokenBalanceWrapper from './NativeTokenBalanceWrapper';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawForm from './WithdrawForm';

export interface OperationFormProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  initialActiveTabIndex?: number;
  onSubmitSuccess?: ModalProps['handleClose'];
}

export const OperationForm: React.FC<OperationFormProps> = ({
  onSubmitSuccess,
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
                  onSubmitSuccess={onSubmitSuccess}
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
          {({ asset, pool }) => (
            <WithdrawForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
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
          {({ asset, pool }) => (
            <BorrowForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
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
                  onSubmitSuccess={onSubmitSuccess}
                />
              )}
            </NativeTokenBalanceWrapper>
          )}
        </AssetAccessor>
      ),
    },
  ];

  return <Tabs tabsContent={tabsContent} initialActiveTabIndex={initialActiveTabIndex} />;
};
